module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // concat: {
    //   options: {
    //     separator: ';',
    //   },
    //   dist: {
    //     src: ['/*.js'],
    //     dest: '.js',
    //   },   
    // },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    // uglify: {
    //   build: {
    //     src: '.js',
    //     dest: '.min.js'
    //   }
    // },

    // jshint: {
    //   files: ['*.js', 'server/**/*.js', 'client/**/*.js'],
    //   options: {
    //     force: 'true',
    //     jshintrc: '.jshintrc',
    //     ignores: []
    //   }
    // },

    // cssmin: {
    //   target: {
    //     files: [{
    //       expand: true,
    //       cwd: 'public',
    //       src: ['*.css', '!*.min.css'],
    //       dest: '',
    //       ext: '.min.css'
    //     }]
    //   }
    // },

    watch: {
      scripts: {
        files: [
          'server/**/*.js',
          'client/**/*.js'
        ]
        // tasks: [
        //   'concat',
        //   'uglify'
        // ]
      }
      // css: {
      //   files: '',
      //   tasks: ['cssmin']
      // }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('test', [
    // 'jshint'
  ]);

  grunt.registerTask('build', [
    // 'concat',
    // 'uglify',
    // 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
