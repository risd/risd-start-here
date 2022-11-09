(function() {
  'use strict';
})();

const jsonImporter = require('node-sass-json-importer')

// const { components, ThemeProvider, themes } = require("@risd/ui");

module.exports = function(grunt) {

  grunt.initConfig({
    pkc: grunt.file.readJSON('package.json'),

    // Watch files for changes and run tasks on changes
    watch: {
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass',
          'postcss',
          'build-styles'
        ]
      },
      browserify: {
        files: ['script/**/*.js'],
        tasks: ['browserify',
          'build-scripts'
        ]
      },
      concat: {
        files: ['<%= concat.dist.src %>'],
        tasks: ['concat',
          'build-static'
        ]
      }
    },


    // Build scss to css
    sass: {
      dev: {
        options: {
          // WebHook will minifiy, so we don't have to here
          style: 'expanded',
          importer: jsonImporter(),
          implementation: require('sass'),
        },
        files: [{
          expand: 'true',
          cwd: 'scss',
          src: ['site.scss'],
          dest: 'static/css',
          ext: '.css'
        },{
          expand: 'true',
          cwd: 'scss',
          src: ['cms.scss'],
          dest: 'static/css',
          ext: '.css'
        }]
      }
    },


    // Add CSS prefixes once the Sass is compiled
    postcss: {
      options: {
        map: true,
        processors: [
          require( 'autoprefixer' )( {
            remove: false,
          } ),
        ],
      },
      distSite: {
        src: 'static/css/site.css',
        dest: 'static/css/site.css',
      },
      distCMS: {
        src: 'static/css/cms.css',
        dest: 'static/css/cms.css',
      },
    },

    // Build process for Javascript
    browserify: {
      options: {
        fullPaths: true,
      },
      index: {
        src: 'script/src/index.js',
        dest: 'static/javascript/index.js',
        options: {
          fullPaths: true,
        },
      },
      content: {
        src: 'script/src/content.js',
        dest: 'static/javascript/content.js',
        options: {
          // debug: true,
          transform: [
            // ['babelify', { presets: ['@babel/preset-env'] }],
          ],
          plugin: [
            ['tinyify', { debug: true }],
          ]
        }
      },

    },

    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: ['script/lib/**/*.js'],
        dest: 'static/javascript/lib.js'
      }
    },

    /**
     * Extending Swig
     * The following gives the user the ability to extend
     * the swig implementation being used to build the site.
     * Each should contain an array of files that can be passed
     * into the `glob` module to query files from the local
     * project, to extend the tags, filters, or functions
     * available the swig instance used to compile templates.
     */
    swig: {
      tags: [
        // require("@risd/webhook-react-tag")
        //   .setComponents(components)
        //   .setThemeProvider(ThemeProvider)
        //   .setTheme(themes.startHere)
      ],
      filters: [
        'swig/concat-clone.js',
        'swig/clone.js',
        'swig/format-wysiwyg.js',
        'swig/external-domain.js',
      ],
      functions: [
        'swig/open-in-new-window-if-external.js',
        'swig/line-svg.js',
        'swig/question-even-or-odd.js',
      ],
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('@lodder/grunt-postcss');
  grunt.loadNpmTasks('grunt-browserify');

  // NEVER REMOVE THESE LINES, OR ELSE YOUR PROJECT MAY NOT WORK
  require('./options/generatorOptions.js')(grunt);
  grunt.loadTasks('tasks');
};
