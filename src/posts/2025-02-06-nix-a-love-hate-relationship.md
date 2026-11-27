---
title: Nix - A love-hate relationship
description: Going over why I fell out of love with Nix and what I use instead
pubDate: 2025-02-02
---

I've been pretty vocal in the past about Nix, and how much I liked it. I've used
Nix to configure everything from software projects' compilers and toolchains to
my dotfiles and entire servers. Configuring everything declaratively and having
stuff just magically ✨ work ✨ is a very nice thing. However... As time has
gone on, I just find myself getting less and less happy with the state of it.

# What does Nix do?

Nix is three things, as described by Blackglasses of [TheAltF4Stream](https://twitch.tv/thealtf4stream);

> Nix is an operating system, a language, and a package manager, but each of
> those things are not the other

Blackglasses actually has [a pretty good ELI5 video](https://youtube.com/watch?v=Vdg7jEk7RSY)
over on YouTube, too.

Nix allows you to [declaratively configure things](https://en.wikipedia.org/wiki/Declarative_programming)
and build and install packages [reproducibly](https://en.wikipedia.org/wiki/Reproducible_builds)
so that you get very close to software running & being built exactly the same
way across multiple computers, and sometimes across multiple platforms, too.

It's a very powerful tool to add to your belt, because it allows you to build
anything you can set up with a shell script as a package and have it work the
same way everywhere. It's especially useful in some more high-stakes use cases
such as the Lattice framework being built by Anduril Industries, where the
software deployed to their devices needs to be verifiably identical between
serial numbers, regardless of whether it's for compliance with defence
standards or for quality control purposes.

Building packages with Nix is pretty simple, too:

```nix
{ stdenv, ... }:
stdenv.mkDerivation {
  name = "haydens-bins";
  version = "unstable";
  src = ./bin;
  installPhase = ''
    mkdir -p $out/bin
    cp * $out/bin
    chmod +x $out/bin/*
  '';
}
```

That code block is how I set up my little utility scripts bundle in my old Nix
dotfiles.

The output of this is a folder in `/nix/store` that contains all of the contents
of the `./bin` directory, all marked as executable with `chmod +x`, which can
then be put into my PATH variable in my shell init file. Very useful stuff.

# Why is Nix cool?

Some of the extra cool stuff with Nix comes in when you start looking at tools
beyond just package management. Things like [NixOS](https://nixos.org),
[home-manager](https://github.com/nix-community/home-manager), and
[nix-darwin](https://github.com/LnL7/nix-darwin). They take the declarative
package generation abilities of Nix, and manage to apply them to configuring an
entire OS (or user environment in the case of home-manager).

Take this piece of config from NixOS for example:

```nix
# Phoebe - My home server
{ pkgs, ... }:
let
  gh-mirror = pkgs.callPackage ../../../pkgs/gh-mirror.nix {};
in
{
  environment.systemPackages = [ gh-mirror ];

  systemd.timers."gh-mirror" = {
    wantedBy = [ "timers.target" ];
    timerConfig = {
      OnBootSec = "5m";
      OnUnitActiveSec = "5m";
      Unit = "gh-mirror.service";
    };
  };

  systemd.services."gh-mirror" = {
    script = ''
      set -eu
      ${gh-mirror}/bin/gh-mirror hbjydev
    '';
    serviceConfig = {
      Type = "oneshot";
      User = "hayden";
    };
  };
}
```

In this block (also taken from my config), we're building my little `gh-mirror`
script, adding it to the system-level `PATH` (by placing it in
`environment.systemPackages`), creating a SystemD service and timer for it that
runs as my user (`hayden`) every five minutes.

The end result of this is that when I rebuild my NixOS config on my server, it
creates a package for systemd configs which generates what, on any other system,
would be inside `/etc/systemd/system`, as a Nix package, including the
`gh-mirror.service` and `gh-mirror.timer`, with a little script to run
`gh-mirror` against my hbjydev GitHub user. It then keeps track of everything
that was rebuilt in my config and creates symlinks where necessary so that
software like SystemD can use them. All-in-all, it means I have one
configuration that declares how my server should run, what it should run,
and when it should run it, in a neat syntax.

I shouldn't need to explain much why this is really cool if you're a sysadmin or
similar, but largely it boils down to the fact that it makes my system config
itself reproducible. I can deploy that config above to as many systems as I
want, and it will work exactly the same way on all of them.

# Where does Nix fall over?

So I've explained what Nix is, what it does, why it's cool, and why I like it.
However, it's time to get into why I don't like Nix, and why I've ultimately
decided to drop it.

Nix does a lot of stuff that's really nice. However, it also throws a lot of how
Linux works to the wind in favour of The Nix Way™. For example, because it puts
everything in /nix/store, unless you run them through Nix, software like
pkg-config and ld just simply won't work properly, because Nix doesn't care
about the Linux [FHS (Filesystem Hierarchy Standard)](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard).

Normally, things like dynamic libraries (*.so files) are supposed to live in
`/lib`, `/usr/lib` and `/usr/share/lib`. This is so that every program has a
standard place to look to find whatever kind of file it needs without needing to
do lots of searching around the system. This is pretty much how all software on
Linux works, with exception for statically-linked binaries, but those are a
whole other can of worms that I'm not going to get into here. Baeldung have a
[good post explaining this](https://www.baeldung.com/cs/static-dynamic-linking-differences)
if you're interested.

Because `/nix/store` says 'screw you' to FHS, it has to change how software
built with it find their libraries. This means that (especially on NixOS, which
only uses Nix for its software) any dynamically-linked binaries (including
things you might need like the OpenShift development toolkit) just will not
work, and in the worst case, cannot be made to work either.

Nix also has one big package repository, [nixpkgs](https://github.com/nixos/nixpkgs),
which is ([according to Repology](https://repology.org/repositories/statistics))
the largest package repository in the Linux ecosystem.

That's great! But the problem with it is that it works by doing 'atomic'
updates. This means that you can't update just one package like you can on other
distributions, you have to update the entire system in one go unless you're
willing to jump through several hoops and get deep into the documentation to
find things like `specialArgs` or overlays.

A lot of people say this is a big benefit of Nix/NixOS, but as a former sysadmin
who's had her fair share of horribly broken systems post-update, this isn't
something I'm comfortable with. I'm not going to suggest that atomicity is
inherently bad, it's just not something I personally like.

All in all, Nix just has... growing pains that I kept hitting, and eventually it
just got too frustrating to be worth the effort I'd been putting in to maintain
my configurations and software installations.

# What do I do now?

So now you know why I do and don't like Nix, you might wonder what I do now.

While I can't keep declaratively configuring everything, I can get somewhat
close to it by using a combination of Chezmoi to manage my dotfiles, and
Homebrew (yes, even on Linux) to manage the software I have installed on my
systems. It's not perfect, but it gives me far more freedom to screw around with
new software and tooling that I couldn't do under Nix.

I hope this post hasn't turned into just a really long-winded rant, I just
wanted to bring attention to some of the issues I had and explain some of it for
people who might be unaware or want to know why I dislike it nowadays.

Thanks for reading along, I hope you enjoyed this post somewhat. If you did,
maybe consider following me on Bluesky, and if you're feeling generous, maybe
consider [buying me a coffee](https://ko-fi.com/haydenuwu). I'm trying to write
more this year, so I'll see you in the next post. 👋

