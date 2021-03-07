# spam_header_checker_for_ocn

# Features

- Thunderbird Add-on(Plugin) (WebExtensions)
- This plugin looks at the header of the mail and assigns a "junk mail" mark.
  - Only if the header (X-CON-SPAM-CHECK) of the mail is set to 100%, it will be marked as "spam".
  - Therefore, it is useless if your mail provider is not OCN.
  - However, if Authentication-Results: spf=pass and dkim=pass are set, the "SPAM" mark will not be set.
  - This is because a successful outgoing domain authentication (SPF) means that it is not spoofed.
- After selecting a mail, a header check is performed, and if it meets the above conditions, the "junk mail" mark will be automatically assigned.
- The following optional features are available
  - Checks for new "received" mail. (Default OFF)
  - Perform mail checking on the entire folder when a folder is selected (default OFF).

# Installing

To install this add-on, Please visit the following page.

in progress.

# Requirement

- Tunderbird version 78 or later

# Author

* Kenichi Tanino
* contact: https://www.tech-law-pyscho.info

# Node

Although it is for OCN, it is not related to OCN. Please do not ask questions to OCN about this plugin.

# History

## v0.5.0

- initial release

# License

This plugin is [MIT license](https://en.wikipedia.org/wiki/MIT_License).