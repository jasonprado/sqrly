<div id="top"></div>

<h3 align="center">sqrly</h3>

  <p align="center">
    A small tool to improve the SQL developer experience in Hasura projects.
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<a href="https://hasura.io/">Hasura</a> is an extremely productive tool for quickly generating robust GraphQL APIs atop SQL databases. Hasura offers several extension points, including writing SQL functions in languages like PL/SQL or PL/pgSQL.

However, the developer workflow for writing SQL code in a Hasura-managed codebase is lacking. The default workflow does not require SQL code to be checked into an application's source tree like any other code. This can lead to error-prone manual workflows like copy/pasting existing functions into new migrations. Reviewing such migrations is nearly impossible.

sqrly offers an opinionated workflow wherein SQL functions are checked into a source tree as `.sql` files. While iterating on SQL code, sqrly will monitor for changed files and automatically apply them to a Postgres database. When it comes time to write out a Hasura migration, sqrly will gather files modified `.sql` files (according to git) and generate a new hasura migration with them.

<!-- GETTING STARTED -->

## Getting Started

```sh
$ npm install -g sqrly
$ sqrly watch --path path/to/sql/files --db postgres://...
-> Monitoring changes to path/to/sql/files/**/*.sql

# Add/edit some SQL code and it will be applied to the DB automatically.

-> Applying file path/to/sql/files/new_sql_function.sql
-> File applied.

# Ctrl-C to exit

$ git status
...
    added: path/to/sql/files/new_sql_function.sql

$ sqrly migrate \
    --name add_new_sql_function \
    --path path/to/sql/files \
    --hasura-dir path/to/hasura/files
-> Generating migration: add_new_sql_function
...
-> hasura migrate completed
```

<!-- USAGE EXAMPLES -->

## Usage

```
Usage: sqrly <command> [options]

Commands:
  sqrly watch    Watch and apply changes in SQL files            [aliases: w]
  sqrly migrate  Generate Hasura migrations for changed SQL files[aliases: m]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -p, --path     The path containing .sql files          [string] [default: "."]
      --dry-run  Print commands that would run; don't actually run
                                                      [boolean] [default: false]
```

```
sqrly watch

Watch and apply changes in SQL files

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -p, --path     The path containing .sql files          [string] [default: "."]
      --dry-run  Print commands that would run; don't actually run
                                                      [boolean] [default: false]
      --db       DSN-style URL to access Postgres DB
```

```
sqrly migrate

Generate Hasura migrations for changed SQL files

Options:
      --help                  Show help                                [boolean]
      --version               Show version number                      [boolean]
  -p, --path                  The path containing .sql files
                                                         [string] [default: "."]
      --dry-run               Print commands that would run; don't actually run
                                                      [boolean] [default: false]
      --name                  Name for the Hasura migration
                                                     [string] [default: "sqrly"]
      --hasura-dir            Path to hasura schema directory           [string]
      --hasura-database-name  Argument to --database-name
                                                   [string] [default: "default"]
      --diff-base             The git commit to diff against to find changed
                              .sql files              [string] [default: "HEAD"]
```

<!-- CONTRIBUTING -->

## Contributing

If you find sqrly useful and would like to contribute improvements to it, please open a pull request!

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

Jason Prado - [@jasonpjason](https://twitter.com/jasonpjason) - jason.prado@gmail.com

Project Link: [https://github.com/jasonprado/sqrly](https://github.com/jasonprado/sqrly)

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

sqrly was developed for use at [The Drivers Cooperative](https://drivers.coop), a driver-owned rideshare service.
