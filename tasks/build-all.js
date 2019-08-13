module.exports = function(grunt) {
  grunt.registerTask( 'build-all', 'Build JS, CSS, templates & pages.', function () {
    grunt.task.run( 'build' )
    grunt.task.run( 'sass' )
    grunt.task.run( 'postcss' )
    grunt.task.run( 'browserify' )
    grunt.task.run( 'build-static' )
  })
}
