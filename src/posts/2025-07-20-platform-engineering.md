---
title: Platform Engineering - Your Little Cloud in the Big Cloud
description: What is Platform Engineering and why is it useful?
pubDate: 2025-07-20
---

I recently accepted a job offer to work on a Platform team. This is huge news
for me because Platform Engineering is what I've always wanted to do in tech,
since the point where I cared enough about infrastructure to have an interest
in DevEx. It's where I always wanted to end up in my career, so I'm very excited
to be starting that role.

However, what I've also noticed is that while Platform Engineers know what it
is they do, it's a relatively recent job description in the grand scheme of
things; the vast majority of people I've spoken to in the Meatspace(tm)(c)(R)
have no idea what Platform actually does. So this post is me conveying my
personal interpretation of what Platform Engineering is, and why a Platform
team is a really useful tool for any organization with an engineering division.

# The Problem

Why does Platform need to exist in the first place? What problem does a Platform
team aim to solve? In broad terms, because infrastructure management is hard.
I've worked with a few companies and 'extra-curricular' volunteering projects
now, and one thing they all have in common; not really wanting to put much
effort into infrastructure. Companies want to spend more time building their
products/projects than they do building the several-layer AWS/GCP/Azure
nightmare that it needs to run smoothly. A lot of companies are happy with
"well we can deploy to it, we can fix the weird things later". Companies with
DevOps teams probably know better, but they'd still rather have engineering
efforts going into the product.

This is where a Platform Engineer would step in.

# So what do they do?

Platform Engineering, at its core, is all about automation of infrastructure.
The main aim, in my opinion, of a Platform team, is to provide other engineering
teams with a series of 'quick wins' with relation to infrastructure management
across the whole software lifecycle. As the (admittedly buzzword-centric)
website platformengineering.org puts it, "Platform engineering is the discipline
of designing and building toolchains and workflows that enable self-service
capabilities for software engineering organizations in the cloud-native era".

Your Platform team's goal in life should be to implement what some have taken to
calling an Internal Development Platform (IDP, not to be confused with IdP, or
"Identity Provider", tech sucks at acronyms). An IDP in concept is like a mini
cloud inside a bigger cloud. It enables development teams to own their
infrastructure, while not needing them to become experts in &lt;insert your cloud
provider here&gt;.

The Platform team will prescribe a 'golden path' for managing things like
databases, Kubernetes clusters, ECS tasks, SQS queues, BigQuery tables, etc.,
and implement that golden path in some form of domain-specific language (DSL)
that the development teams can interact with. The system that uses this DSL
(whether that takes the form of a web app, a Git repo with YAML, or convoluted
Terraform modules) will then know how to translate the simplified "what do we
need?" specification the devs have put forward into actual deployed
infrastructure.

# You talk too much, give me a scenario, man!

Okay okay, fine. The example I often give in interviews or when talking to
people offline about the benefit of Platform is this; your developers need a
database for the app they're deploying. They know they need MySQL, they know
their drivers will work fine on MySQL 8, and they know it needs to be accessible
by their app. What they have no care for is how the backups are provisioned, how
the VPC allows connections, how the security groups are set up, etc. They just
want a database and some credentials to feed their app on the next release.

With an IDP in place, this could be distilled down to a simple YAML file
describing what they want.

```yaml
---
version: v1
kind: Database
metadata:
    name: myapp-db
spec:
    engine:
        type: mysql
        version: '8.0.40'
    storageGbs: 10
    readReplica: true
```

With this YAML snippet here, the developers have prescribed to us that they
want:

- A MySQL database, running version 8.0.40
- 10GBs of storage on that database
- A provisioned read replica for the database (maybe they want some sort of
  analytics system to talk to it. We don't care, it's their database)

So now, our IDP can go away and deploy the system they want. They haven't had to
learn AWS, they just needed to know in broad strokes what they wanted and tell
us about it, then the IDP went and... did it for them. Just like that.

Now maybe there are some side effects of this, like having a new database
credentials secret provisioned that the system tells them about, but largely
you get the picture.

The whole point is distilling down infrastructure into an interface that doesn't
need developers to be former SREs to manage. It enables self-service
infrastructure management, allowing dev teams to own their infrastructure, and
crucially, allows your organization to move to a more shift-left process
compared to the age-old helpdesk ticket system that someone needs to stare at
constantly for new requests. Which has the added bonus of freeing up your
support and former infrastructure staff to deal with the constant influx of
"whoops this broke" and continuous improvement tasks they've been wanting to
nuke off the backlog for the past 18 months.

# Okay cool, which company's product should I buy?

Well, the short answer to this is... you shouldn't. Every company has their own
needs, and every 'developer experience' platform exists to make money from you.
This includes open-source but off-the-shelf software stacks like Spotify's
Backstage.

Your company has its own processes, its own definitions of an "application", its
own standards to comply with, its own software stacks, etc. You should be
developing your IDP for your company's needs, not making it fit what Soundcloud
did in the mid-2010s and wrote a whitepaper on. I'm a big believer in "the tools
should fit you, not you fit the tools". If you're changing the entire concept of
infrastructure internally by using the tool you picked up, you've done it wrong.

Because of this, my recommendation is to build something in-house. It can start
out small, just a series of infrastructure-as-code files in Terraform in a Git
repo somewhere, then maybe it gets some YAML abstraction to configure it easier.
Maybe a few months down the line, your dev teams complain the YAML is terse, so
you want to put a user interface around it. So you build a web app that edits
that YAML for them, and maybe while you're doing that, you bake in backup
monitoring and deployment status into that platform, too.

Let yourself start small. Grow as your teams need. Many a culture-change
initiative have shot themselves in the foot by building too much too early on,
or by being too different from the existing processes from the get-go. Make
waves, advocate for change, but be aware that while you can see the vision, the
burden of proof is on you as well to show the business that it's a good use of
time, and that it's not going to be harder than just shooting IT an email.

With that said, I hope this post has been helpful to you, and that it opens you
up to a potential Platform-driven future. I tried to convey the reasons I'd
implement this best I could, but I'm sure there are better posts out there to
cover the subject should you be so inclined. Thanks for reading.

