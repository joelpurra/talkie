*Please fill out the following to help us help you. Replace `...` with your own values, where applicable. Tick of the applicable items in the checklists with `[x]`.*



### Description

...



### Steps to verify functionality

...



### General checklist

- [ ] The code works as expected.
- [ ] All tests pass.
- [ ] The pull request follows the steps for a [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/) feature.
- [ ] The pull request has been made against the `develop` branch.



### Translation checklist

- [ ] All messages shown or spoken to the user are using `chrome.i18n.getMessage("myMessageName").`
- [ ] Any new or changed message string have been updated in `_locales/en/base.json`.
- [ ] Any new or changed message string have been updated in `_locales/*/override.json` for languages you know.



### Code checklist

- [ ] The code has sanity checks (null values, string lengths, etcetera).
- [ ] Relevant functions and passages uses `promiseTry(() => { ... })` with `return` and `throw` statements.
- [ ] Errors are handled gracefully.



### Additional information

...
