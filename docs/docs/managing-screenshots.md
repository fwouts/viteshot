---
sidebar_position: 6
---

# Managing Screenshots

ViteShot helps you generate screenshots, but that's not the entire story. To achieve visual testing, you need a way to store screenshots and easily compare them across commits.

You can choose between several approaches:

- storing screenshots in Git (or Git LFS)
- uploading them to S3 and comparing them with [reg-suit](https://github.com/reg-viz/reg-suit)
- using a third-party such as [Percy](https://percy.io)

## Option 1: Storing screenshots in Git

The simplest approach is to store screenshots in Git.

We recommend using [Git LFS](https://git-lfs.github.com) to store screenshots. This will help prevent your Git repository from becoming bloated over time, as each updated screenshot would otherwise increase the repository's size.

If you're unfamiliar with Git LFS, you can learn about it with [this short video (2 min)](https://www.youtube.com/watch?v=uLR1RNqJ1Mw) and/or by going through [the official tutorial](https://github.com/git-lfs/git-lfs/wiki/Tutorial).

To set up Git LFS, [install the Git extension](https://git-lfs.github.com/) and add the following to `.gitattributes` in your repository ([source](https://github.com/americanexpress/jest-image-snapshot/issues/92#issuecomment-493582776)):

```
**/__screenshots__/*.* binary
**/__screenshots__/*.* filter=lfs diff=lfs merge=lfs -text
```

### Reviewing screenshots

When you store screenshots in Git, updated screenshots will appear alongside updated code in your usual pull request review interface.

### Screenshot consistency

To ensure that screenshots are always identical, it's recommended that you generate screenshots on CI.

You can run `viteshot -p` to automatically push new commits that update screenshots once they've been updated. This will fail on `main` and `master` branches.

This command works out of the box with GitHub Actions, however you may need to set up Git credentials on other CI platforms.

## Option 2: Storing screenshots in S3

If you prefer to store screenshots independently from your Git repository, one of the best options is [`reg-suit`](https://github.com/reg-viz/reg-suit). Once configured, it will automatically upload generated screenshots to your own S3 bucket.

reg-suit also includes GitHub and GitLab plugins that will automatically add a comment on each pull request, pointing out any updated screenshots.

## Option 3: Using Percy

When you use [Percy](https://percy.io), your screenshots are generated and stored in the cloud. You also get a separate screenshot review and approval interface, which is particularly convenient when working in large teams.

If you'd like to use Percy, please refer to the [browsers and viewports](/docs/config/browsers#alternative-percy-shooter) documentation.

## Option 4: Upcoming `screendiff` platform

The author of `viteshot` is designing a screenshot upload and comparison platform that gives you simplicity and peace of mind at an affordable cost.

If you'd like to participate in early trials, please get in touch at screendiff@zenc.io.
