---
title: Developer Tooling
description: What I do for toolchains, config, and cross-puter config.
pubDate: 2025-10-03
---

This post covers what I do for toolchain management, and keeping config the
same across multiple computers. It was originally given as a talk at
[Acquired.com](https://acquired.com) where I work, but now I'm sharing it with
the world because... blog posts.

# Dotfiles

**What are they?** Dotfiles are named after (on \*NIX systems at least) all the
config files that live in `.` folders (`.config`, `.local`, etc.). They're where
all your config probably lives. The Windows equivalent of this is somewhere like
`AppData` and all the child directories (`Local`, `Roaming`, etc.).

A lot of your tool configurations live in there, and in most cases, you've
probably got a handful of tools that you've configured to work in a way _you_
like that might not necessarily be the default. Those configurations are
annoying to then replicate on other machines manually, especially when you
inevitably forget that one really useful config flag or alias you had that
you've got the muscle memory for.

That's why I choose to use a tool to help me manage configuration. I like having
my development setup work 'just so', and I like having muscle memory for doing
things. There's a lot of creature comforts I have in my workflow, like my Neovim
config and how specifically it works, or my shell aliases that let me quickly
run things like `dclf` instead of `docker compose logs -f`. I also have some
scripts I want on multiple machines, like `license`, which pulls down an open
source license and drops it into a `LICENSE` file, or `gitignore`, which grabs
a well-known `.gitignore` file from the web so I don't have to write them by
hand every time I start a new project.

# Why not scripts? Why a tool?

Scripts suck to manage, and have no way to keep track of state. That's about it
really, they're just cumbersome and they have the potential to break constantly.

# Git 'bare repos'

I tried bare repos at one point, but quickly ended up looking for something
else. They're annoying to manage because `git status` no longer functions, and
there's no hydrated copy of the repo anywhere for you to check things in.

There's also no way to automate things like tool installations between computers
so you have to remember which tools you install and where you get them from.

# Nix

[Nix](https://nixos.org) is **very** cool conceptually. It lets you build out a
configuration *declaratively*, effectively turning your whole setup into one big
config file. It works pretty well until you get into some of the higher-level
concerns than "do I have x tool installed?"

Nix infects a lot of environment variables, and requires system-wide access to
work properly, which breaks compilers and such (changing the `LD_PATH` and
`PKG_CONFIG_PATH` env vars for instance breaks a lot of programs like Steam or
`gcc`, which prevents things like `rustc` from being able to compile sometimes.)

Nix is also hard to cleanly _remove_ after you're done with it without losing
all of your config. Tools like `home-manager` use symlinks to files in Nix's own
file store (`/nix/store`), which means that uninstalling Nix also wipes all of
those files and breaks your symlinks. You can't tell it to dump those files into
your filesystem, so there's no 'clean path' to replace `home-manager` or
similar.

Nix's package management setup is *atomic*, meaning unless you're willing to
jump through several hoops and learn DSL-specific things like nixpkgs overlays
and pinned dependencies, updating your toolchain can be a pretty destructive
operation.

Here's an example of a tiny config that uses `home-manager` to manage your
user-specific packages and configuration:

```nix
{ pkgs, ... }:
{
    # install my packages
	home.packages = with pkgs; [
		git
		nodejs
		lazygit
		neovim
		terraform
	];
	
	programs.zsh = {
		enable = true;
		enableCompletions = true;
		shellAliases = {
			ll = "ls -l";
			update = "sudo nixos-rebuild switch";
		};
	};
}
```

In this setup, let's say there's a new Neovim version that's been released. I
want to update my setup, so I do `nix flake update` in my config folder, and
Neovim is now running on version `0.10` instead of `0.9`. Cool. Let me go test
it on my new repo. Oh... Now `lazygit` doesn't open because there's a bug in it.
But because I'm using Nix, it's gonna take me an hour to find all the working
configs and write an overlay to roll back the tool version. No bueno, señor.

# Chezmoi

[Chezmoi](https://chezmoi.io) is what drives my current setup, and it's really
easy to use. It works by having a Git repo cloned to `~/.local/share/chezmoi`
with features like templating, some filename-based directives to control how
your files are put in your config, and being able to run scripts on different
rules depending on what you want to do.

It also has the ability to use secrets management tools and password managers
(including your own custom ones if you want), with support for the following at
the time of writing:

- 1Password
- BitWarden
- Doppler
- KeePassXC
- gopass
- Encryption tools like `age`, `gpg` and `rage` (`age`'s Rust-rewritten cousin)

Using those secrets tools also means you can have your config automatically
authenticate you against other systems and protect more sensitive information
(like your email address or SSH keys) in a password manager instead of having
them in plaintext in a GitHub repo somewhere.

Because Chezmoi just uses Git, it's really easy to take it from one system and
just drop it onto another system. They even have a command to make it easier (if
you're happy with running Bash one-liners):

```shell
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply hbjydev
```

This will clone `hbjydev/dotfiles` from GitHub and apply it locally, running all
the scripts I configured and all.

If you want to look through my dotfiles repo, head over to [`hbjydev/dotfiles`](https://github.com/hbjydev/dotfiles)
and take a look around. Some of the various things you'll see in there are:

- Scripts with the `run_onchange` directives, etc.
- Symlinks
- File permissions directives
- Using 1Password to inject secrets like tokens & emails

---

# Toolchains

Now, my setup extends beyond app configuration. Let's talk about dev toolchains.
I'm not talking about things like my editor here, I'm talking compilers, SDKs,
runtimes, etc.

These things are a little less easy than `apt-get install <tool>` typically.
Different projects want to run on different versions of the
language/compiler/SDK, so they need a little bit of special attention.

Previously, Nix kind of solved for this by using Flakes, which are config-local
setups that provide tools and configuration. However, given what I said about
atomic updates, that setup also kind of falls apart pretty quickly. Also, Flakes
in Git repos need to be checked in and committed to work properly, which means
that unless we want configuration for one developer in the repo that nobody else
will use, they're kinda broken.

Instead, I found a tool called [mise](https://mise.jdx.dev). Mise is really
cool, because it gives me the project-scoped config that Nix Flakes used to do,
but it works by just keeping a local store of SDK installations that it switches
around in PATH when you go into different directories on your system.

Here's a Mise configuration file.

```toml
[tools]
dotnet = "9.0"
just = "1.41.0"
```

This you'd store in a file in your repo called `mise.toml`, and when you go into
that folder, Mise will automatically inject environment variables into your
shell that loads the specific versions of `dotnet` and `just` defined in that
config file.

It also handles _installing_ those tools for you, and if you don't have the
specific versions listed in the file, you just run `mise install` and it handles
it all for you.

Now, this is cool on its own, because now you can have config in a project that
means all of your developers in a repo are running the same exact version, which
helps cut down on those "works on my machine" non-reproducible errors, and also
means nobody's working with language features that don't exist in the older
version that everyone else is on.

However, Mise is so simple that it also works in CI environments, too, by way of
the `jdx/mise-action` GitHub Action (and even if that didn't exist, it's
stupidly simple to install in a CI setup). Here's an example GitHub action taken
from the [`acqctl` repo](https://github.com/acquiredcom/acqctl.git).

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      actions: read
      checks: write
    steps:
      - uses: actions/checkout@v4
      - uses: jdx/mise-action@v2

      - run: just test

      - uses: dorny/test-reporter@v2
        if: ${{ !cancelled() }}
        with:
          name: Acqctl Tests
          path: ./TestResults/acqctl_*.trx
          reporter: dotnet-trx
          fail-on-error: false
```

You can see that we're using `jdx/mise-action`, which will install all the tools
in our `mise.toml` file into the CI environment, which in this case installs
`dotnet` 9 and `just`, which is my preferred project script tool (like a
Makefile but more modern). This ensures that the version of .NET and `just` I'm
running on my machine are the same ones being used in the build & test steps in
CI, which, barring architecture-specific differences, means any issues CI flags
up should be entirely reproducible on my local machine.

All of this together leads to a much happier developer environment where
everyone's running the same things, and makes debugging issues a fair bit easier
between developers and between you and automation.

# Getting Started

So now I've given you a run-down of how it all fits together, why not give it a
try on your own machines? Get the two tools installed (they're both in Homebrew
for Mac and Linux users, and they're available in `winget` for Windows users).

## Mise (Toolchain)

Let's start with Mise because it's the simpler of the two tools. First, you want
to get Mise to inject itself into your shell.
([Documentation here](https://mise.jdx.dev/installing-mise.html#shells))

**Zsh:**

```zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

**Bash:**

```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

**Fish (weirdo):**

```fish
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
```

**PowerShell:**

```powershell
echo 'mise activate pwsh | Out-String | Invoke-Expression' >> $HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

Now we've done that, give your shell a restart, and go into one of your project
repos. Let's say we've gone into a repository with a .NET 8 project. To add a
tool to your config (and create a config if it doesn't already exist), you can
run;

```shell
mise use dotnet@8
```

This should run for a little bit, install the tool you told it to install into
the installations directory it keeps, and then leave you with a new `mise.toml`
that looks like this:

```toml
[tools]
dotnet = "8"
```

If you do `which dotnet` on a UNIX system, you'll now see something similar to
this:

```shell
$ which dotnet
/Users/hyoung/.local/share/mise/installs/dotnet/8.0.413//dotnet
```

Congrats, you're now using Mise to manage your project-specific toolchain!

## Chezmoi (Dotfiles)

```shell
chezmoi init
chezmoi add ~/.zshrc
```

Now if you go to `~/.local/share/chezmoi`, you'll see there's now a file called
`dot_zshrc`, and you'll also see that you're in a Git repo. Let's commit the new
ZSH config file:

```shell
git add dot_zshrc
git commit -m "feat: add my zsh config"
```

Let's then get a GitHub repo going (I recommend making it private until you
learn how to do secrets properly in Git):

```shell
gh repo create dotfiles --private --source .
git push -u origin main
```

Now, you have dotfiles managed by Git that you can set up on another machine.
You can test this in a VM. Make one, then run the `init --apply` command I gave
above. In my case;

```shell
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply hbjydev
```

This will pull down `hbjydev/dotfiles` to `~/.local/share/chezmoi` and because
we gave it the `--apply` flag, it will automatically apply my config locally. In
that VM, you should now have the same `~/.zshrc` file you had on your original
machine.

---

Well done, now you know a little more about dotfiles. Go forth and configure!
Let me know how you get on by @'ing me
[on Bluesky](https://bsky.app/profile/hayden.moe) maybe.
