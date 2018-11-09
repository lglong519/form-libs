const fs = require('fs');
const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const nconf = require('nconf');

nconf.file('.config');
nconf.required([
	'SERVER',
	'SERVER_USERNAME',
	'SERVER_HOST',
	'SSH_PORT',
	'LOCAL_KEY',
	'PRIVATE_KEY',
]);

let privateKey;
let localKey = nconf.get('LOCAL_KEY');
if (fs.existsSync(localKey)) {
	privateKey = fs.readFileSync(localKey);
} else {
	privateKey = nconf.get('PRIVATE_KEY');
}
if (!privateKey) {
	throw new SyntaxError('Invalid privateKey');
}
const config = {
	host: nconf.get('SERVER_HOST'),
	port: nconf.get('SSH_PORT'),
	username: nconf.get('SERVER_USERNAME'),
	privateKey
};

const gulpSSH = new GulpSSH({
	ignoreErrors: false,
	sshConfig: config
});
const destGlobs = [
	'./dist/**',
	'./dist/**/*'
];
gulp.task('dest', () => gulp
	.src(destGlobs)
	.pipe(gulpSSH.dest(nconf.get('SERVER'))));
gulp.task('shell', () => gulpSSH
	.shell([
		`cd ${nconf.get('SERVER')}`,
		'rm -r ./*',
	], {
		filePath: 'shell.log'
	})
	.pipe(gulp.dest('logs')));
gulp.task(
	'deploy',
	gulp.series('shell', 'dest')
);
