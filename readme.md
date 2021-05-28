# alfred-jira-navigator

> An alfred thingy for navigating through jira

Use Alfred to navigate through a Jira project's hierarchy of epics, stories, and tasks. This is very much a side project and nearly unsupported. 

## Pre-reqs and Installation
- [Node.js](https://nodejs.org/en/) (You don't need to know anything about Node.js since it runs in the background—if you don't have Node.js, you can download it [here](https://nodejs.org/en/#download))
- [Alfred v4 and Powerpack](https://www.alfredapp.com/powerpack/)
- An API token for Jira. Learn how to [generate them here](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)

Download "" from the Latest Release here: [https://github.com/swilliams/alfred-jira-navigator/releases](https://github.com/swilliams/alfred-jira-navigator/releases)

When that file is downloaded, double click the `.alfredworkflow` to install it and open it up.

Click the [_x_] to open the environment variables panel.

![Alfred](https://cdn.zappy.app/eaa2e9bc9fd4d7bad25174c2bc4d2a56.png)

Add a Workflow Environment Variable named `basicAuth`. Enter the API token from Jira as the value for it.

![Env](https://cdn.zappy.app/f1e0bdb0d01f22e07ddf989a6fe0e0e9.png)

Click save.

## Usage

The works on some preconceived ideas of hierachies in that a Jira project has Epics, and Epics have tickets associated with them. 

1. The trigger word is `jira` and it first accepts the name (or abbreviation) of the project you like to open. Alfred will search and present any projects that match what you type. Pressing <kbd>Enter</kbd> will move you on to step 2. Pressing <kbd>⌘ Enter</kbd> will open that project in your browser. 
2. Alfred will search for all the Epics in that project that you type. It will **only** load Epics and only ones that are not closed. Press <kbd>Enter</kbd> to continue to step 3 or <kbd>⌘ Enter</kbd> to open that Epic in your browser. If no Epics match the search string, pressing <kbd>Enter</kbd> will open a browser window to Jira's search page and search for what you entered.
3. Alfred will search all of the tickets within that epic that match what you type. Pressing <kbd>Enter</kbd> on any of the results will open that ticket in your browser. This will **only** load tickets that are not closed.

## What don't work
* If you're in Step 2 or 3 and backspace back into the prefix things get wonky. You'll have to <kbd>Esc</kbd> and start over.

## License

MIT © [Scott Williams](https://swilliams.me)
