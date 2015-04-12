/*global module:false */
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    // package.jsonに設定されている内容を取得
    pkg: grunt.file.readJSON("package.json"),
    paths: {
      development: 'development/',
      production: 'production/',
      src_dir: '<%= paths.development %>src/',
      dest_dir: '<%= paths.development %>dest/',
      css_dir: 'css/',
      js_dir: 'js/',
      spec_dir: 'spec/',
      img_dir: 'images/',
      font_dir: 'fonts/',
      sprite_dir: 'sprites/',
      lib_dir: 'lib/',
      docs_dir: 'docs/styleguide/'
    },
    bower: {
      install: {
        options: {
          targetDir: '<%= paths.dest_dir %><%= paths.lib_dir %>',
          layout: 'byComponent',
          install: true,
          verbose: true,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },
    assemble: {
      site: {
        options: {
          layoutdir: '<%= paths.src_dir %>layouts',
          data: ['<%= paths.src_dir %>data/**/*.{json,yml}'],
          partials: ['<%= paths.src_dir %>partials/**/*.hbs'],
          assets: '<%= paths.dest_dir %>'
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src_dir %>pages/',
          src: '**/*.hbs',
          dest: '<%= paths.dest_dir %>'
        }]
      }
    },
    jsbeautifier: {
      files: ['<%= paths.dest_dir %>**/*.html'],
      options: {
        html: {
          braceStyle: 'collapse',
          indentChar: ' ',
          indentScripts: 'keep',
          indentSize: 4,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u'],
          wrapLineLength: 0
        }
      }
    },
    htmlhint: {
      options: {
        htmlhintrc: '.htmlhintrc'
      },
      html1: {
        src: ['<%= paths.dest_dir %>**/*.html']
      }
    },
    sass: {
      dist: {
        options: {
          sourcemap: true,
          style: 'expanded',
          bundleExec: true
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src_dir %><%= paths.css_dir %>',
          src: ['*.scss'],
          dest: '<%= paths.dest_dir %><%= paths.css_dir %>',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9']
      },
      file: {
        expand: true,
        flatten: true,
        src: '<%= paths.dest_dir %><%= paths.css_dir %>*.css',
        dest: '<%= paths.dest_dir %><%= paths.css_dir %>'
      }
    },
    sprite: {
      sass: {
        src: '<%= paths.src_dir %><%= paths.sprite_dir %>*.png',
        destImg: '<%= paths.src_dir %><%= paths.img_dir %>sprite.png',
        destCSS: '<%= paths.src_dir %><%= paths.css_dir %>sprites.scss',
        algorithm: 'binary-tree',
        padding: 5,
        cssFormat: 'scss',
        cssOpts: {
          functions: false,
          cssClass: function(item) {
            return '.sprite-' + item.name;
          }
        }
      }
    },
    clean: {
      styleguide: ['<%= paths.docs_dir %>'],
      production: ['<%= paths.production %>'],
      dest: ['<%= paths.dest_dir %>']
    },
    styleguide: {
      styledocco: {
        options: {
          name: 'Project Name',
          framework: {
            name: 'styledocco',
            options: {
              preprocessor: 'bundle exec scss'
            }
          }
        },
        src: [
          '<%= paths.src_dir %><%= paths.css_dir %>**/*.scss'
        ],
        dest: '<%= paths.docs_dir %>'
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 30000,
        hostname: '127.0.0.1'
      },
      livereload: {
        options: {
          open: true,
          base: ['.']
        }
      },
    },
    open: {
      dev: {
        path: 'http://127.0.0.1:9000/<%= paths.dest_dir %>'
      }
    },
    esteWatch: {
      options: {
        dirs: [
          '<%= paths.src_dir %>**'
        ],
        livereload: {
          enabled: true,
          extensions: ['hbs', 'scss', 'js', 'yml'],
          port: 30000
        }
      },
      hbs: function(filepath) {
        filepath = filepath;
        return ['assemble', 'jsbeautifier', 'htmlhint'];
      },
      scss: function(filepath) {
        filepath = filepath;
        return ['sass', 'autoprefixer'];
      },
      js: function(filepath) {
        filepath = filepath;
        return ['karma', 'copy:js_to_dest'];
      },
      yml: function(filepath) {
        filepath = filepath;
        return ['assemble', 'jsbeautifier'];
      },
      '*': function(filepath) {
        filepath = filepath;
        return ['copy:images_to_dest'];
      }
    },
    // ファイルをコピーする
    copy: {
      html_to_production: {
        expand: true,
        cwd: '<%= paths.dest_dir %>',
        src: ['**/*.html'],
        dest: '<%= paths.production %>'
      },
      js_to_dest: {
        expand: true,
        cwd: '<%= paths.src_dir %><%= paths.js_dir %>',
        src: ['**/*.js'],
        dest: '<%= paths.dest_dir %><%= paths.js_dir %>'
      },
      images_to_dest: {
        expand: true,
        cwd: '<%= paths.src_dir %><%= paths.img_dir %>',
        src: ['**'],
        dest: '<%= paths.dest_dir %><%= paths.img_dir %>'
      },
      images_to_production: {
        expand: true,
        cwd: '<%= paths.dest_dir %><%= paths.img_dir %>',
        src: ['**'],
        dest: '<%= paths.production %><%= paths.img_dir %>'
      },
      fonts_to_production: {
        expand: true,
        cwd: '<%= paths.dest_dir %><%= paths.lib_dir %>font-awesome/<%= paths.font_dir %>',
        src: ['**'],
        dest: '<%= paths.production %><%= paths.font_dir %>'
      }
    },
    // HTMLを圧縮する
    htmlmin: {
      all: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeOptionalTags: true
        },
        expand: true,
        cwd: '<%= paths.production %>',
        src: ['**/*.html'],
        dest: '<%= paths.production %>'
      }
    },
    useminPrepare: {
      html: ['<%= paths.dest_dir %>**/*.html'],
      options: {
        dest: '<%= paths.production %>'
      }
    },
    usemin: {
      html: ['<%= paths.production %>**/*.html'],
      css: ['<%= paths.production %>css/*.css'],
      options: {
        assetsDirs: ['<%= paths.dest_dir %>', '<%= paths.dest_dir %>images']
      }
    },
    // 画像を圧縮する
    image: {
      static: {
        files: {}
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= paths.production %><%= paths.img_dir %>',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= paths.production %><%= paths.img_dir %>'
        }]
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });
  // 開発用プラグインをロード
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-este-watch');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-karma');

  // 納品用プラグインをロード
  grunt.loadNpmTasks('grunt-styleguide');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-image');

  // 初期化コマンド *開発コマンドの前に行う
  grunt.registerTask('init', ['clean', 'bower', 'assemble', 'jsbeautifier', 'sprite', 'sass', 'autoprefixer', 'copy:js_to_dest', 'copy:images_to_dest']);
  // 開発用コマンド
  grunt.registerTask('default', ['connect', 'open', 'esteWatch']);
  // スタイルガイド生成コマンド
  grunt.registerTask('guide', ['clean:styleguide', 'styleguide']);
  // 納品用コマンド
  grunt.registerTask('product', ['init', 'styleguide', 'useminPrepare', 'copy:images_to_production', 'copy:html_to_production', 'copy:fonts_to_production', 'image', 'concat', 'uglify', 'cssmin', 'usemin', 'htmlmin']);

};
