module.exports = function(grunt) {
  grunt.registerTask( 'build-all', 'Build JS, CSS, templates & pages.', function () {
    grunt.task.run( 'build' )
    grunt.task.run( 'sass' )
    grunt.task.run( 'autoprefixer' )
    grunt.task.run( 'browserify:client' )
    grunt.task.run( 'build-static' )
  })
}
