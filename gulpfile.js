const { parallel, series, dest, src, watch } = require("gulp");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GulpSSH = require("gulp-ssh");
const run = require("gulp-run-command");

const config = {
  remoteFolderPath: "/home/pi/ws281x",
  ssh: {
    host: "192.168.1.250",
    port: 22,
    username: "pi",
    password: "alive",
  },
};

const SSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config.ssh,
});

const deploy = () =>
  src(["**/*.*", "*.*", "!node_modules/**/**/*"]).pipe(SSH.dest(`${config.remoteFolderPath}/`));

const cleanupRemote = () =>
  SSH.exec([`rm -rf ${config.remoteFolderPath}/src/**/*`]);

exports.watchTask = () =>
  watch(
    ["./src/**/*"],
    series(
      parallel(cleanupRemote),
      deploy
    )
  );