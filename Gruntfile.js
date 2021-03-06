/*!
 * Gruntfile.js - build script
 *
 * Copyright (c) 2013-2014 Matthew A. Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-github-pages");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-release");
    grunt.loadNpmTasks("grunt-bump");

    grunt.initConfig({
        bump: {
            options: {
                commit: false,
                createTag: false,
                push: false
            }
        },
        jsdoc: {
            all: {
                src: [
                    "README.md",
                    "index.js",
                    "lib/*.js",
                    "mechanisms/*.js"
                ],
                dest: "doc",
                options: {
                    template: "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure: "jsdoc.json"
                }
            }
        },
        nodeunit: {
            all: ["test/index.js"],
            options: {
                reporter: "default"
            }
        },
        githubPages: {
            doc: {
                options: {
                    commitMessage: "updated docs"
                },
                src: "doc"
            }
        },
        release: {
            bump: false,
            tagMessage: "v<%= version %>",
            commitMessage: "Release <%= version %>"
        },
        shell: {
            cover: {
                command: "./node_modules/.bin/istanbul" +
                         " cover" +
                         " --report html" +
                         " ./node_modules/.bin/nodeunit test/index.js",
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        },
        clean: {
            coverage: [ "coverage" ]
        }
    });

    grunt.registerTask("doc",
                       "Generate API documentation",
                       ["jsdoc:all"]);
    grunt.registerTask("test",
                       "Run all unit tests",
                       ["shell:cover"]);

    grunt.registerTask("publish",
                       "Publishes next version",
                       ["bump", "test", "doc", "githubPages", "release"]);
    grunt.registerTask("publish:patch",
                       "Publishes next patch version",
                       ["bump:patch", "test", "doc", "githubPages", "release"]);
    grunt.registerTask("publish:minor",
                       "Publishes next minor version",
                       ["bump:minor", "test", "doc", "githubPages", "release"]);
    grunt.registerTask("publish:major",
                       "Publishes next major version",
                       ["bump:major", "test", "doc", "githubPages", "release"]);

    grunt.registerTask("default", ["test", "doc"]);
};
