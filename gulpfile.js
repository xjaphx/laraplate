// Get modules
var gulp = require('gulp');
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var changed = require('gulp-changed');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// variables
var slash = '/';
var tasks = {
    watch: {}
};

// define path
var client = {
    "path": "./client",
    "build" : {
        "path": "./client/build",
        "dev": {
            "path": "./client/build/dev",
            "assets": {
                "path": "./client/build/dev/assets",
                "css": {
                    "path": "./client/build/dev/assets/css"
                },
                "js": {
                    "path": "./client/build/dev/assets/js"
                },
                "img": {
                    "path": "./client/build/dev/assets/img"
                },
                "fonts": {
                    "path": "./client/build/dev/assets/fonts"
                }
            }
        },
    },
    "source" : {
        "path": "./client/source",
        "bower": {
            "path": "./client/source/bower"
        },
        "jade": {
            "path": "./client/source/jade"
        },
        "sass": {
            "path": "./client/source/sass"
        },
        "scripts": {
            "path": "./client/source/scripts"
        },
        "resources": {
            "path": "./client/source/resources",
            "fonts": {
                "path": "./client/source/resources/fonts"
            },
            "images": {
                "path": "./client/source/resources/images"
            }
        }
    }
};

var server = {
    "path": "./server",
    "public" : {
        "path": "./server/public",
        "assets": {
            "path": "./server/public/assets"
        }
    }
};


/****************************************************
 * DEVELOPMENT TASKS
 ****************************************************/
/**
 * Move fonts
 *
 * @task    dev:fonts
 */
gulp.task('dev:fts', ['dev:fonts']);
gulp.task('dev:fonts', function() {
    gulp.src(client.source.resources.fonts.path + slash + "*.*")
        .pipe(gulp.dest(client.build.dev.assets.fonts.path));
});

/**
 * Move images
 *
 * @task    dev:images
 */
gulp.task('dev:img', ['dev:images']);
gulp.task('dev:images', function() {
    gulp.src(client.source.resources.images.path + slash + "*.*")
        .pipe(gulp.dest(client.build.dev.assets.img.path));
});

/**
 * Move all resources (fonts, images)
 *
 * @task    dev:resources
 */
gulp.task('dev:res', ['dev:resources']);
gulp.task('dev:resources', [
    'dev:fonts',
    'dev:images'
]);

/**
 * Build HTML from Jade templates
 *
 * @task    dev:templates
 * @alias   dev:html
 */
gulp.task('dev:html', ['dev:templates']);
gulp.task('dev:templates', function() {
    gulp.src(client.source.jade.path + slash + '*.jade')
        .pipe(jade({  }))
        .pipe(gulp.dest(client.build.dev.path));
});

/**
 * Build JS (minify, concat, rename)
 *
 * @task    dev:scripts
 * @alias   dev:js
 */
gulp.task('dev:js', ['dev:scripts']);
gulp.task('dev:scripts', function() {
    gulp.src(client.source.scripts.path + slash + '**/*.js')
        .pipe(uglify())
        .pipe(concat('app.js', { newLine: ";" }))
        .pipe(rename({
            basename: "app",
            suffix: '.min'
        }))
        .pipe(gulp.dest(client.build.dev.assets.js.path));
});

/**
 * Build CSS from SASS
 *
 * @task    dev:styles
 * @alias   dev:css
 */
gulp.task('dev:css', ['dev:styles']);
gulp.task('dev:styles', function() {
    gulp.src(client.source.sass.path + slash + '**/*.scss')
        .pipe(sass({
            style: "compact"
        }))
        .pipe(gulp.dest(client.build.dev.assets.css.path));
});


/**
 * Build everything (fonts, images, js, css, html)
 *
 * @task    dev
 */
gulp.task('dev', [
    'dev:fonts',
    'dev:images',
    'dev:css',
    'dev:js',
    'dev:html'
]);

/****************************************************
 * DISTRIBUTION TASKS
 ****************************************************/

/**
 * Distribute assets
 *
 * @task    dist:assets
 */
gulp.task('dist:assets', function() {
    gulp.src(client.build.dev.assets.path + slash + "**/*.*")
        .pipe(gulp.dest(server.public.assets.path));
});

/**
 * Distribute everything to server
 *
 * @task    dist
 */
gulp.task('dist', [
    'dist:assets'
]);

/****************************************************
 * OTHER TASKS
 ****************************************************/
/**
 * Clean development directory
 *
 * @task    clean
 */
gulp.task('clean', function() {
    gulp.src(client.build.dev.path, {read: false})
        .pipe(clean());
});


/**
 * Watch for style change
 *
 * @task    watch:styles
 * @alias   watch:css
 */
gulp.task('watch:css', ['watch:styles']);
tasks.watch.css = function () {
    gulp.watch(client.source.sass.path + slash + '**/*.scss', [
        'dev:css'
    ]);
};
gulp.task('watch:styles', tasks.watch.css);

/**
 * Watch for script change
 *
 * @task    watch:scripts
 * @alias   watch:js
 */
gulp.task('watch:js', ['watch:scripts']);
tasks.watch.js = function() {
    gulp.watch(client.source.scripts.path + slash + '**/*.js', [
        'dev:js'
    ]);
};
gulp.task('watch:scripts', tasks.watch.js);

/**
 * Watch for template change
 *
 * @task    watch:templates
 * @alias   watch:html
 */
gulp.task('watch:html', ['watch:templates']);
tasks.watch.html = function () {
    gulp.watch(client.source.jade.path + slash + '**/*.jade', [
        'dev:html'
    ]);
};
gulp.task('watch:templates', tasks.watch.html);

 /**
  * Watch for files (css/js/html) change to update
  *
  * @task   watch
  */
gulp.task('watch', function() {
    tasks.watch.css();
    tasks.watch.js();
    tasks.watch.html();
});

/**
 * The default task
 *
 * @task    (empty)
 */
gulp.task('default', ['']);
