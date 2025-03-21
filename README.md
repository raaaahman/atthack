# AttHack

An Interactive Fiction about spying softwares, social engineering and hacking culture. 

Original version made for the [GitHub Game Off 2024](https://itch.io/jam/game-off-2024). Use tag `github-gameoff-2024` to see the game as submitted.

## About the game

In this game, the player takes the role of a student in a college that uses an extranet to connect its students, teachers and administrators. The player receives a contact from a mysterious informer that wants to share a frightening discovery about the school network.

They will both embark in a journey of smoke and mirrors, using social engineering and hacking to discover what their school is hiding from them.

## About the repository

### Closed for contribution

This repository is public but the team is not looking to add additional members.

- You are welcome to report a bug.
- You are welcome to submit a patch for a security issue (not that we expect to make some...).
- Feature requests won't be taken into account (for now at least).

### Open Source Code

The _Source Code_ (all the files inside the `src` directory) is open for everyone to learn from, use and modify. Just don't expect your modification to be included in this repository.

The Source Code in this repository is licensed under _MIT License_, see details in [src/license.txt](./src/license.txt). It builds upon tools and libraries (the _Dependencies_, referenced but not included) that have their own licenses, you should verify the terms of each of those licenses on your own.

### Copyrighted Content

The _Content_ (story, interactive scripts, character names, fictive places, logos, pictures, etc.) is still subject to the intellectual property rights. You are **not** allowed to share, distribute, modify nor sell it on any support or platform.

## Development

### Repository structure

This repository uses **Git submodules* to store the content.

To clone the repository and its submodules, use the command: 

```bash
git clone --recurse-submodules https://github.com/raaaahman/atthack
```

To work on the content alone, commit, psuh and pull **from the `public` folder**.

Read more about Git submodules in [Git documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

### Development server

This project uses Vite 6 for its development server, which requires Node.js version 18, 20, 22 or higher. 

To install the development server and its dependencies, run the command:

```bash
npm run install
```

To start the development server, run the following command:

```bash
npm run dev
```

It will reload automatically when content has changed.

## Credits

- [YarnBound by @mnbroatch](https://github.com/mnbroatch/yarn-bound)
- [DaisyUI by Pouya Saadeeghi](https://daisyui.com/) ([MIT](https://github.com/saadeghi/daisyui/blob/master/LICENSE))
- [Big Smile by Ashley Seo](https://www.figma.com/community/file/881358461963645496) ([CCBY 4.0](https://creativecommons.org/licenses/by/4.0/))
- [Thumbs by Dicebear](https://www.dicebear.com/) ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/))
- [Shapes by Dicebear](https://www.dicebear.com/) ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/))

## Disclaimer

THIS WORK IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION IN THIS WORK WILL PRODUCE ANY PARTICULAR RESULT OR BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
