---
title: Work Smarter, Not Harder; Template your project configs!
description: Get rid of consistent inconsistency using configuration templating.
pubDate: 2025-04-07
---

So the title here is a touch clickbaity. If you mainly work on open source, or
if you don't work for a company with enough consistency that your config files
look largely similar project-to-project, this blog post is not for you. However,
if you work somewhere where you feel setting up new projects & updating existing
ones ends up being a copy-paste exercise of "what setting did Project A use?"
and "what was that thing I did that fixed this in Project C?"... Maybe give this
a read.

# Context

A little background; in and out of my day job, I do DevOps work. Whether it's
for my job, personal projects, or working with friends outside of a job context.
We recently were going through the process of upgrading our projects to a new OS
release. One by one, we kept having to copy configs from the first project we
did to the next one, etc. This took an age to build and test. We were holding
up releases by weeks in some cases. Then we built a templating tool that knows
how we build our software, and more importantly, how we deploy that software,
and can generate all of these configuration files for us. This kept our configs
standardised, which lowered our mental overhead when hopping from project to
project, and has also helped us with applying improvements and optimisations to
multiple projects in short passes since then, too. This has massively helped
with how quickly we can roll out changes and how reliable those changes are, and
the point of this post is to convince you, assumedly a DevOps engineer tired of
copypasta configs, that there is a better way.

Now, in an environment where you're deploying things to a platform like EC2,
ECS, Kubernetes, GCE, whichever, and you have multiple projects side-by-side,
you probably have a pretty high level of overlap when it comes to configuration.
This might come in the form of web server configuration (for tools like Gunicorn
or Nginx), it might come in the form of standardised CI/CD pipeline configs (for
GitHub Actions, GitLab CI, whichever), or it might just be your monitoring
configurations. If you look at the files themselves, and you look at how they
look in one project versus two or three others, my bet is that you'll probably
spot that they're largely the same. They might be formatted differently, have
different arguments or values passed, but they're doing the same things, in the
same ways, with some small differences here and there. One project might need a
10s timeout where another might need 30s, for instance.

# What am I suggesting?

Something Blackglasses of ALT-F4 taught me was the value of turning that
overlapping config into a truly standard, reusable configuration by turning them
into templates. I've always had a thing for enforcing consistency wherever it
makes sense, because, A, maintaining configuration is way easier if everything
works roughly the same way, and B, it makes it far easier to roll out
configuration updates across the board.

To achieve this, something we did for ALT-F4 (see [build-configs](https://github.com/ALT-F4-LLC/build-configs))
and at my day job, was build a template CLI that has a set of our 'standard'
configurations, divided into 'types' based on what kind of project we need
templates for (for instance, you probably need different configs for a Django
app compared to a binary Go Lambda), and set it up for the projects we have to
maintain.

If I can configure my entire project's required setup with a simple YAML file,
along these lines:

```yaml
---
name: companyapp
template:
  type: django
  grafanacloud:
    alloy:
      prefix: myapp
      log_jobs:
        api: /var/log/company/api.log
```

and have it automatically spit out my Gunicorn configuration file, my Alloy log
monitoring configs, my Django environment files, etc., all I need to do is plumb
those into my deployment system, and not actually care at all about
triple-checking that everything works. The configuration templates are standard.
And running this takes maybe 30 seconds. That's far quicker than going to a few
other projects that have similar needs, copying their config files, 'reusing'
(read: probably changing for no reason) the file naming convention, pasting
their config files, searching for instances of the old project name, renaming
it, checking the file is valid, etc.

Is it foolproof? Very much no. Templating tools don't do away with human error.
The templates they use to spit out configs are only as good as the person who
wrote them's knowledge of how the file should work. But saying that, they can be
very beneficial once they reach critical mass in terms of usage and you have
75-80% of the cross-project permutations accounted for in your templates.

# Go forth and learn

Now, instead of rambling on for hours about why this is cool and boring you with
the 7 paragraphs saying the same thing I tend to end up writing when I try to
do longer-form posts like this, I'm going to give an exercise to the reader. Go
forth, build a version of this tool for your job, for your personal projects,
whatever you have time for. Spend maybe an hour on your proof-of-concept form,
and apply it to 3 different projects. The tool should take a configuration file
of sorts, in your chosen format and file type (JSON, YAML, TOML, whatever), and
spit out relevant configurations based on templates bundled with the tool. The
configuration should not include every little detail of the generated
configurations, only the bits you know need to change from project to project.

I'm not going to tell you how to implement this. That's out of scope for this
post. However, I can give you a rough plan; pick a language, figure out how to
make small CLI tools with it, pick a templating engine, and pick a
configuration format.

Go forth and work smarter, not harder. Make cross-project configuration easy.
See the benefits for yourself.
