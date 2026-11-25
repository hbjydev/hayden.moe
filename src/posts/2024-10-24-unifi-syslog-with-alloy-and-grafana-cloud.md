---
title: Unifi syslog with Alloy and Grafana Cloud
description: Setting up Alloy to ingest Unifi device logs over syslog and ship them to gcloud.
pubDate: 2024-10-24
---

Recently, I decided I wanted to keep syslog entries for all of my Unifi devices
somewhere instead of doing nothing with them. However, I'm already pushing up a
lot of my network's stuff to Grafana Cloud already because I'm a Loki and
Grafana shill. So I decided to set up Unifi to log its stuff over syslog to
Alloy.

Hang on though, Promtail only lets you log to syslog with a newer format than
what Unifi devices send.

> The messages must be compliant with the RFC5424 format.

\- [Promtail Docs](https://grafana.com/docs/alloy/latest/reference/components/loki.source.syslog/)

This is a problem, because Unifi devices don't send in RFC5424, they send in
RFC3164 instead. That's an issue. However, if we put an 'intermediary' between
the two and use some of Alloy's loki.process nodes, we can sort of hack this
together.

First off, we'll install syslog-ng. It provides us the ability to parse RFC3164
inbound logs, which makes this process pretty simple. We'll slap this in its
configuration:

```
source udp { syslog(ip(0.0.0.0) port(514) transport("udp")); };
destination syslog_in { file("/var/log/syslog-in"); };
log { source(udp); destination(syslog_in); };
```

This will open a listener on `0.0.0.0:514` over UDP, which we can then point the
Unifi Controller at for logging.

Once we've done that, the logs will end up in `/var/log/syslog-in`, which we can
then read and parse with Alloy.

Let's look at our Alloy config for this:

```hcl
loki.process "syslog" {
  stage.regex {
    expression = `(?P<ts>[A-Z][a-z][a-z]\s{1,2}\d{1,2}\s\d{2}[:]\d{2}[:]\d{2})\s(?P<host>[\w][\w\d\.@-]*)\s(?P<log>.*)$`
  }

  stage.labels {
    values = { hostname = "host" }
  }

  stage.timestamp {
    source = "ts"
    format = "Jan _2 15:04:05"
  }

  stage.output {
    source = "log"
  }

  forward_to = [gcloud.stack.default.logs]
}

loki.source.file "syslog" {
  targets = [
    { __path__ = "/var/log/syslog-in", job = "syslog" },
  ]
  forward_to = [loki.process.syslog.receiver]
}
```

This configuration will go through, read `/var/log/syslog-in`, set
`job="syslog"` as a label, then do some processing to pull out the relevant info
we need.

We parse the log line with a regex query that works for parsing RFC3164 lines,
then read the `host` capture group in as the hostname label on the log line, and
finally parse the timestamp value from the `ts` capture group with the relevant
Go time format string.

Finally, we remove everything except the actual log itself (stripping out the
timestamp and hostname from the lines) and forward to Grafana Cloud.

This is a hacky way around an annoying problem, but it works for me, and
hopefully helps some people do what I was trying to sort out.

I've got this all configured in NixOS, so
[here's that configuration](https://github.com/hbjydev/dots.nix/tree/526fc36d45af789a3a55ee0f7b0320c18a691af8/nixos/roles/unifi)
if you want to steal it. `default.nix` has the main configuration (including
setting up syslog-ng), and `config.alloy` has the syslog Alloy config shown
above.
