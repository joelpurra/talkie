module.exports = {
	packageFile: "./{,packages/*/}package.json",
	reject: ["@talkie/*", "husky"],
	target: (packageName, versionRanges) => {
		// https://git.coolaj86.com/coolaj86/semver-utils.js#semverutils-parse-semverstring
		// NOTE: keep v0.x.y in v0.x.z range.
		// https://semver.org/#spec-item-4
		if (versionRanges[0].major === "0") {
			return "patch";
		}

		return "minor";
	},
};
