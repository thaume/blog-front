module.exports = function(grunt) {

  'use strict';

  var config = {

    pkg: grunt.file.readJSON('package.json'),

    // Concatenate files
    concat: {
      options: {
        separator: ';'
      },

      lib: {
        files: {
          'build/js/lib.js': [
            'src/js/lib/*.js'
          ]
        }
      },

      main: {
        files: {
          // Order Matter
          'build/js/main.js': [
            'src/js/*.js',
            '!src/js/lib/*.js'
          ]
        }
      },

      core: {
        files: {
          // Order Matter
          'build/js/core.js': [
            'src/js/lib/*.js',
            'src/js/*.js'
          ]
        }
      }
    },

    // LINT JavaScript code - there are JSHint configuration files for client-
    // and server-side JavaScript
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      with_overrides:{
        files: {
          src: [
            'Gruntfile.js',
            'src/js/**/*.js',
            '!src/js/lib/**/*.js'
          ]
        }
      }
    },

    // Minify and optimize JS files
    uglify: {
      options: {
        compress: {
          sequences: false
        }
      },
      core: {
        src: 'build/main.js',
        dest: 'build/main.js'
      }
    },

    // Compile SCSS to CSS
    sass: {
      dev: {
        files: {
          'build/css/screen.css': 'src/css/screen.scss'
        }
      }
    },

    // Hash files for cache busting
    hash: {
      src: 'public/assets/build/**/*.*', //all your js that needs a hash appended to it
      mapping: 'assets.json', //mapping file so your server can serve the right files
      dest: 'public/assets/dist' //where the new files will be created
    },

    // Compress any images
    imagemin: {
      release: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: 'src/img/',
            src: ['**/*.{png,jpg,jpeg,gif}'],
            dest: 'build/css/images'
          }
        ]
      }
    },

    // Watch resources and recompile on the fly
    watch: {
      styles: {
        options: {
          livereload: true
        },
        files: 'src/css/**/*.scss',
        tasks: ['sass']
      },

      scripts: {
        options: {
          livereload: true
        },
        files: 'src/js/**/*.js',
        tasks: ['jshint', 'concat:main']
      }
    }
  };

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-hash');

  // Register tasks
  grunt.initConfig(config);

  grunt.registerTask('default', 'Launch the front-end dev envrionement', [
    'build:dev',
    'watch'
  ]);

  grunt.registerTask('build:dev', 'Build a development version of thau.me', [
    'sass',
    'jshint',
    'concat'
  ]);

  grunt.registerTask('build:release', 'Build a production version of thau.me', [
    'sass',
    'concat',
    'uglify',
    'imagemin:release',
    'hash'
  ]);
};
