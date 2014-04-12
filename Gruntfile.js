/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    //   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    //   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    //   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // // Task configuration.
    // concat: {
    //   options: {
    //     banner: '<%= banner %>',
    //     stripBanners: true
    //   },
    //   dist: {
    //     src: ['lib/<%= pkg.name %>.js'],
    //     dest: 'dist/<%= pkg.name %>.js'
    //   }
    // },
    uglify: {
      // options: {
      //   banner: '<%= banner %>'
      // },
      dist: {
        src: 'tabmenu.js',
        dest: 'dist/tabmenu.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          console: true,
          chrome: true,
          $: true,
          event: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      tabmenu: {
        src: ['tabmenu.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      // gruntfile: {
      //   files: '<%= jshint.gruntfile.src %>',
      //   tasks: ['jshint:gruntfile']
      // },
      dev: {
        files: ['popup.html', 'tabmenu.scss', 'tabmenu.js'],
        tasks: ['sass:dev', 'jshint', 'uglify', 'copy', 'image_resize', 'notify:watch']
      }
    },
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          './dist/tabmenu.css': './tabmenu.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          './dist/tabmenu.min.css': './tabmenu.scss'
        }
      }
    },
    copy: {
      main: {
        src: 'manifest.json',
        dest: 'dist/manifest.json'
      },
      bootstrap: {
        src: 'bower_components/sass-bootstrap/dist/js/bootstrap.min.js',
        dest: 'dist/bootstrap.min.js'
      },
      jQuery: {
        src: 'bower_components/jquery/dist/jquery.min.js',
        dest: 'dist/jquery.min.js'
      },
      js: {
        src: 'tabmenu.js',
        dest: 'dist/tabmenu.js'
      },
      html: {
        src: 'popup.html',
        dest: 'dist/popup.html'
      },
      fonts: {
        expand: true,
        cwd: 'bower_components/sass-bootstrap/dist/fonts/',
        src: '**',
        dest: 'dist/fonts/',
        flatten: true,
        filter: 'isFile',
      }
    },
    image_resize: {
      icon_128: {
        options: {
          width: 128,
          height: 128,
          overwrite: true
        },
        files: {
          'dist/assets/icon128.png': 'assets/icon.png'
        }
      },
      icon_48: {
        options: {
          width: 48,
          height: 48,
          overwrite: true
        },
        files: {
          'dist/assets/icon48.png': 'assets/icon.png'
        }
      },
      icon_19: {
        options: {
          width: 19,
          height: 19,
          overwrite: true
        },
        files: {
          'dist/assets/icon19.png': 'assets/icon.png'
        }
      },
      icon_16: {
        options: {
          width: 16,
          height: 16,
          overwrite: true
        },
        files: {
          'dist/assets/icon16.png': 'assets/icon.png'
        }
      }
    },
    notify: {
        watch: {
          options: {
            title: 'Watch Done',
            message: 'Tasks all run well'
          }
        }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-image-resize');
  grunt.loadNpmTasks('grunt-notify');

  // Default task.
  grunt.registerTask('default', ['sass:dev', 'jshint', 'uglify', 'copy', 'image_resize',]);
  grunt.registerTask('build', ['sass:dist', 'jshint', 'uglify', 'copy', 'image_resize']);

};
