<!--
 * Author: johnfonseka <shan4max@gmail.com>
 * Project: chrome-block-sites
 * Date: 10/10/2025
-->

# Extention: Page Blocker

**Motivation**

I'm finding that the time spent on short-form video content, such as reels, is becoming excessive. This consumption is now significantly impacting my career and other key aspects of my life. I suspect it is contributing to increased stress and several cognitive issues, including a diminished attention span and a lack of motivation.

To address this, I have decided to develop a simple plugin to block access to these platforms, specifically Facebook and YouTube (while YouTube Music will remain accessible).

## Configurations

Blocked sites are stored at
https://www.npoint.io/docs/4a65cbcfe0556bbb9ace

**JSON format**

```
{
  "password": "my-pass",
  "allowed_sites": [
    "music.youtube.com",
  ],
  "blocked_sites": [
    {
      "url": "facebook.com"
    },
    {
      "url": "youtube.com",
      "time": {
        "s": 18,
        "e": 22
      },
      "allow_on_time": true
    },
    {
      "url": "primevideo.com",
      "time": {
        "s": 11,
        "e": 13
      },
      "allow_on_time": true
    }
  ]
}
```

**Functions**

If we have only the URL in the configurations, it will be simply blocked whole day.

But if we have a time specified and `allow_on_time` flag set, then depending on the time, period and action, site will be either blocked or allowed.

Since the implementation is **blocked first**, `time` and `allow_on_time` can actually be used only to timely allow a site. But not timely block a site. That means, `allow_on_time: false` does not make any difference.

## TODO

- Remove locally stored very much under-utilized _tailwind_ css
- Add keyword based blocks
- Add password bypass
- Better utilize network calls with local storage
- Better way to store data more securely and reliably
- Function to limit number of time a one can visit a page for a given time period

TODO far far away

- Add a dashboard to show site stats based on base url, keyword

## Thanks

Thanks to https://www.npoint.io/ for allowing me to store and access config JSON for free. This seems like a great simple tool. Just to store and access JSON.
