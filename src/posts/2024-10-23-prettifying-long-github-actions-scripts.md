---
title: Prettifying long GitHub Actions scripts
description: How to use GitHub Actions workflow commands to improve script output legibility.
pubDate: 2024-10-23
---

So I was building out the CI/CD setup for
[vms.nix](https://github.com/ALT-F4-LLC/vms.nix) and I wasn't a fan of how
messy and unreadable the output of the AMI publisher script was. It does a lot,
so there's a lot of text spewed out.

Initially, I wanted to just break it up into visual sections with newlines, but
I found that this did very little to actually help out. So I did some digging,
and stumbled across
[workflow commands](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions).

Welp, time to start playing around.

---

The TL;DR here is that GitHub Actions actually has a fair few things you can do
to change its behaviour at runtime.

To steal their entire description from the docs linked above;

> Actions can communicate with the runner machine to set environment variables,
> output values used by other actions, add debug messages to the output logs,
> and other tasks.Most workflow commands use the echo command in a specific
> format, while others are invoked by writing to a file.

They look along these lines:

```bash
echo "::workflow-command parameter1={data},parameter2={data}::{command value}"
```

Which end up then, like it says, triggering tasks on the runner machine.

One such magical thing is the `group`/`endgroup` directive. They let you create
'fenced' output. The syntax is simple:

```bash
echo "::group::Title"
echo "Stuff that"
echo "Goes inside"
echo "The group"
echo "::endgroup::"
```

That then ends up having a togglable dropdown group to 'hide' the output. So
you can focus on the broad strokes and only drill down into your output when
needed.

You can see how this works in vms.nix;
[here's an Actions run](https://github.com/ALT-F4-LLC/vms.nix/actions/runs/9333518231/job/25690648434#step:8:16)
[and the script that it runs](https://github.com/ALT-F4-LLC/vms.nix/blob/def0bfb04fdb21edbbf76f8668e7cd8a42274526/ci-build-publish.sh).
