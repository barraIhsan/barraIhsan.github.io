let vimCmdActive: Boolean = false;
let vimCmdAllowInput: Boolean = false;
let vimCmdWaitNextInput: Boolean = false;

const vimCmdHidden: Array<string> = ["hidden"];
const vimCmdRight: Array<string> = ["text-right"];
const vimCmdAllowInputClass: Array<string> = ["after:content-['█']"];
const vimCmdError: Array<string> = ["italic", "text-red-400"];

// get pathname and delete the last `/` if it exists
// and if it's root (`/`) just return back the `/`
const pathname = window.location.pathname.replace(/\/$/, "") || "/";

function enterVimCmd(vimCmd: HTMLParagraphElement, readOnly: Boolean = false) {
  vimCmdActive = true;
  vimCmd.textContent = "";
  vimCmd.classList.remove(...vimCmdHidden, ...vimCmdError, ...vimCmdRight);
  if (!readOnly) {
    vimCmdAllowInput = true;
    vimCmd.classList.add(...vimCmdAllowInputClass);
  }
}

function exitVimCmd(vimCmd: HTMLParagraphElement) {
  vimCmdActive = false;
  vimCmdAllowInput = false;
  vimCmd.classList.add(...vimCmdHidden);
  vimCmd.classList.remove(...vimCmdAllowInputClass);
}

function appendVimCmd(key: String, vimCmd: HTMLParagraphElement) {
  // ensure it's one character and
  // insert non breaking space if the user inputted a space
  if (key.length == 1) vimCmd!.textContent! += key == " " ? "\u00A0" : key;
}

function echoVimCmd(
  text: string,
  error: Boolean,
  vimCmd: HTMLParagraphElement,
  right: Boolean = false,
) {
  // enter vim cmd mode with readonly
  // just incase it's not active
  // and clear the right text and error
  enterVimCmd(vimCmd, true);

  if (error) vimCmd.classList.add(...vimCmdError);
  if (right) vimCmd.classList.add(...vimCmdRight);
  vimCmd.innerHTML = text; // using `innerHTML` here, so we can put links / html tag
  vimCmdAllowInput = false;
  vimCmd.classList.remove(...vimCmdAllowInputClass);
}

function deleteVimCmd(vimCmd: HTMLParagraphElement) {
  // if it's the last char, exit
  if (vimCmd.textContent!.length == 1) exitVimCmd(vimCmd);
  else vimCmd.textContent = vimCmd?.textContent?.slice(0, -1) || "";
}

function executeVimCmd(vimCmd: HTMLParagraphElement) {
  // if the user didn't input anything,
  // it will close the cmd prompt
  if (vimCmd.textContent!.length == 1) {
    exitVimCmd(vimCmd);
    return;
  }
  // remove the first `:` and
  // split them into array seperated by non breaking space
  let commands: Array<string> = vimCmd.textContent!.slice(1).split("\u00A0");

  // command
  let saveCmd: Array<string> = ["w", "wa"];
  let saveForceCmd: Array<string> = ["w!", "wa!"];
  let quitCmd: Array<string> = [
    "q",
    "qa",
    "wq",
    "wqa",
    "q!",
    "qa!",
    "wq!",
    "wqa!",
  ];
  let setCmd: Array<string> = ["set", "se"];
  let fileCmd: Array<string> = ["f", "file"];
  let editCmd: Array<string> = ["e", "edit"];
  let helpCmd: Array<string> = ["h", "help"];

  if (saveCmd.includes(commands[0])) {
    echoVimCmd(
      `E45: 'readonly' option is set (add ! to override)`,
      true,
      vimCmd,
    );
  } else if (saveForceCmd.includes(commands[0])) {
    echoVimCmd(
      `E212: Can't open file for writing: permission denied`,
      true,
      vimCmd,
    );
  } else if (quitCmd.includes(commands[0])) {
    echoVimCmd(
      `Unforunately, you can't close tab using JavaScript. See: <a href='https://developer.mozilla.org/en-US/docs/Web/API/Window/close' class='underline' target='_blank'>window.close() on MDN</a>`,
      true,
      vimCmd,
    );
  } else if (setCmd.includes(commands[0])) {
    // TODO: add some option
    if (commands[1])
      echoVimCmd(`E518: Unknown option: ${commands[1]}`, true, vimCmd);
    else exitVimCmd(vimCmd);
  } else if (commands[0].startsWith("%s") || commands[0].startsWith("s")) {
    echoVimCmd(`Substitute won't be supported`, true, vimCmd);
  } else if (commands[0].startsWith("!")) {
    echoVimCmd(`Running shell command won't be supported`, true, vimCmd);
  } else if (fileCmd.includes(commands[0])) {
    // get scroll percentage
    const pct = (
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100
    ).toFixed(0);

    if (pathname == "/") {
      echoVimCmd(`"src/pages/index.astro" --${pct}%--`, false, vimCmd);
    } else if (pathname.startsWith("/blog/")) {
      echoVimCmd(
        // cut the first `/blog/` and replace it with `src/content/blogs/`
        `"src/content/blogs/${pathname.slice(6)}.mdx" --${pct}%--`,
        false,
        vimCmd,
      );
    } else {
      echoVimCmd(`"src/pages${pathname}.astro" --${pct}%--`, false, vimCmd);
    }
  } else if (editCmd.includes(commands[0])) {
    // home
    let home: Array<string> = ["/", "home", "index"];
    let url: string = "";

    if (!commands[1]) {
      // if no parameter passed, just go to the same site
      url = window.location.href;
    } else if (home.includes(commands[1])) {
      // go to home page if it's not defined
      url = "/";
    } else if (commands[1].endsWith(".astro")) {
      // go to the page if the user add `.astro`
      url = "/" + commands[1].slice(0, -6);
    } else if (commands[1].endsWith(".mdx")) {
      // go to blog if the user add `.mdx`
      url = "/blog/" + commands[1].slice(0, -4);
    } else if (commands[1] == "github") {
      // socials
      url = "https://github.com/barraIhsan";
    } else if (commands[1] == "twitter" || commands[1] == "x") {
      url = "https://twitter.com/barrsan_";
    } else {
      // just go to that url
      url = "/" + commands[1];
    }

    // go to that url
    window.location.href = url;
  } else if (helpCmd.includes(commands[0])) {
    echoVimCmd(`Help command coming soon!`, true, vimCmd);
  } else {
    echoVimCmd(
      `E492: Not an editor command: ${commands.join(" ")}`,
      true,
      vimCmd,
    );
  }
}

function scroll(amount: number) {
  // if the amount is 0, it will scroll to the top
  // else, it will "add" to the scroll
  window.scrollTo({
    top: parseInt(`${amount == 0 ? 0 : window.scrollY + amount}`),
    behavior: "smooth",
  });
}

const vimCmd = document.querySelector("#vimCmd") as HTMLParagraphElement;

// for navigating blogs with j and k
// get all the `a` tag in blogs
const blogs = document.querySelectorAll(
  "#blogs li a",
) as NodeListOf<HTMLAnchorElement>;
// set the pointer initially at -1
let blogsPointer: number = -1;

window.addEventListener("keydown", (e) => {
  // vim cmd
  if (!vimCmdActive || !vimCmdAllowInput) {
    if (e.key == ":") enterVimCmd(vimCmd);

    // pressing g once, will display `g` in the bottom right
    // pressing g again, will clear the displayed `g` and scroll to the top
    // if g is pressed once and not pressed again,
    // will clear the displayed `g` and do nothing
    if (!vimCmdWaitNextInput) {
      if (e.key == "g") {
        vimCmdWaitNextInput = true;
        echoVimCmd("g", false, vimCmd, true);
      }
    } else {
      // if the next key is g again
      if (e.key == "g") scroll(0);

      exitVimCmd(vimCmd);
      vimCmdWaitNextInput = false;
    }
  }

  if (vimCmdActive || !vimCmdAllowInput) {
    if (e.key == "Escape" || (e.key == "[" && e.ctrlKey)) {
      exitVimCmd(vimCmd);
    }

    // vim motion (j and k)
    if (pathname == "/blogs") {
      // move the pointer
      if (e.key == "j") blogsPointer++;
      else if (e.key == "k") blogsPointer--;

      // focus on the blog
      // loopback if exceeded
      if (blogsPointer == blogs.length) blogsPointer = 0;
      else if (blogsPointer < 0) blogsPointer = blogs.length - 1;

      // focus only if j or k pressed
      if (e.key == "j" || e.key == "k") blogs[blogsPointer].focus();
    } else {
      // if it's not in blogs, just scroll
      if (e.key == "j") scroll(200);
      else if (e.key == "k") scroll(-200);
    }

    // vim motion (the rest)
    if (e.key == "d" && e.ctrlKey) {
      scroll(700);
      e.preventDefault();
    } else if (e.key == "u" && e.ctrlKey) {
      scroll(-700);
      e.preventDefault();
    } else if (e.key == "G") {
      scroll(document.body.scrollHeight);
    }
  }

  if (vimCmdActive && !vimCmdAllowInput) {
    if (e.key == "Enter") {
      exitVimCmd(vimCmd);
    }
  }

  if (vimCmdActive && vimCmdAllowInput) {
    if (e.key == "Backspace") {
      deleteVimCmd(vimCmd);
    } else if (e.key == "Enter") {
      executeVimCmd(vimCmd);
    } else {
      appendVimCmd(e.key, vimCmd);
      e.preventDefault();
    }
  }
});
