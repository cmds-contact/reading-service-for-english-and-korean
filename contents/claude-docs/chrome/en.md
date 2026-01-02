# Use Claude Code with Chrome (beta)

English

# Use Claude Code with Chrome (beta)

Connect Claude Code to your browser to test web apps, debug with console logs, and automate browser tasks.

> Chrome integration is in beta and currently works with Google Chrome only. It is not yet supported on Brave, Arc, or other Chromium-based browsers. WSL (Windows Subsystem for Linux) is also not supported.

## What the integration enables

- **Live debugging**: Claude reads console errors and DOM state directly, then fixes the code that caused them
- **Design verification**: Build a UI from a Figma mock, then have Claude open it in the browser and verify it matches
- **Web app testing**: Test form validation, check for visual regressions, or verify user flows work correctly
- **Authenticated web apps**: Interact with Google Docs, Gmail, Notion, or any app you’re logged into without needing API connectors
- **Data extraction**: Pull structured information from web pages and save it locally
- **Task automation**: Automate repetitive browser tasks like data entry, form filling, or multi-site workflows
- **Session recording**: Record browser interactions as GIFs to document or share what happened

## Prerequisites

- [Google Chrome](https://www.google.com/chrome/) browser
- [Claude in Chrome extension](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) version 1.0.36 or higher
- [Claude Code CLI](/docs/en/quickstart#step-1:-install-claude-code) version 2.0.73 or higher
- A paid Claude plan (Pro, Team, or Enterprise)

## How the integration works

> The Chrome integration requires a visible browser window. When Claude performs browser actions, you’ll see Chrome open and navigate in real time. There’s no headless mode since the integration relies on your actual browser session with its login state.

## Set up the integration

Update Claude Code

```
claude update
```

Start Claude Code with Chrome enabled

```
claude --chrome
```

Verify the connection

## Try it out

```
Go to code.claude.com/docs, click on the search box,
type "hooks", and tell me what results appear
```

## Example workflows

### Test a local web application

```
I just updated the login form validation. Can you open localhost:3000,
try submitting the form with invalid data, and check if the error
messages appear correctly?
```

### Debug with console logs

```
Open the dashboard page and check the console for any errors when
the page loads.
```

### Automate form filling

```
I have a spreadsheet of customer contacts in contacts.csv. For each row,
go to our CRM at crm.example.com, click "Add Contact", and fill in the
name, email, and phone fields.
```

### Draft content in Google Docs

```
Draft a project update based on our recent commits and add it to my
Google Doc at docs.google.com/document/d/abc123
```

### Extract data from web pages

```
Go to the product listings page and extract the name, price, and
availability for each item. Save the results as a CSV file.
```

### Run multi-site workflows

```
Check my calendar for meetings tomorrow, then for each meeting with
an external attendee, look up their company on LinkedIn and add a
note about what they do.
```

### Record a demo GIF

```
Record a GIF showing how to complete the checkout flow, from adding
an item to the cart through to the confirmation page.
```

## Best practices

- **Modal dialogs can interrupt the flow**: JavaScript alerts, confirms, and prompts block browser events and prevent Claude from receiving commands. If a dialog appears, dismiss it manually and tell Claude to continue.
- **Use fresh tabs**: Claude creates new tabs for each session. If a tab becomes unresponsive, ask Claude to create a new one.
- **Filter console output**: Console logs can be verbose. When debugging, tell Claude what patterns to look for rather than asking for all console output.

## Troubleshooting

### Extension not detected

- Verify the Chrome extension (version 1.0.36 or higher) is installed
- Verify Claude Code is version 2.0.73 or higher by running `claude --version`
- Check that Chrome is running
- Run `/chrome` and select “Reconnect extension” to re-establish the connection
- If the issue persists, restart both Claude Code and Chrome

### Browser not responding

- Check if a modal dialog (alert, confirm, prompt) is blocking the page
- Ask Claude to create a new tab and try again
- Restart the Chrome extension by disabling and re-enabling it

### First-time setup

## Enable by default

> Enabling Chrome by default increases context usage since browser tools are always loaded. If you notice increased context consumption, disable this setting and use `--chrome` only when needed.

## See also

- [CLI reference](/docs/en/cli-reference) - Command-line flags including `--chrome`
- [Common workflows](/docs/en/common-workflows) - More ways to use Claude Code
- [Getting started with Claude for Chrome](https://support.anthropic.com/en/articles/12012173-getting-started-with-claude-for-chrome) - Full documentation for the Chrome extension, including shortcuts, scheduling, and permissions

Was this page helpful?
