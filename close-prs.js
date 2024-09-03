const daysThreshold = 30;
const github = require('@actions/github');
const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);

const owner = github.context.repo.owner;
const repo = github.context.repo.repo;

async function closePRsWithoutLinkedIssues() {
  const { data: pullRequests } = await octokit.pulls.list({ owner, repo, state: 'open' });

  for (const pr of pullRequests) {
    const { data: issues } = await octokit.issues.listForRepo({ owner, repo, per_page: 100 });

    const linkedIssue = issues.find(issue =>
      issue.pull_request && issue.pull_request.url === pr.url
    );

    if (!linkedIssue) {
      await octokit.pulls.update({ owner, repo, pull_number: pr.number, state: 'closed' });
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body: "This pull request has been closed because it does not mention the issue that it solves. Please refer to the [Contributing files](https://github.com/Sulagna-Dutta-Roy/GGExtensions/blob/master/CONTRIBUTING.md) to help you add this information. Then, tag the maintainers so your PR can be reopened."
      });
    }
  }
}

closePRsWithoutLinkedIssues();
