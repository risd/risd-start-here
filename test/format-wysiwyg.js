const test = require('tape')
const { format_wysiwyg } = require('../swig/format-wysiwyg.js')

test('remove-empty-p-tags', (t) => {
  const input = `<p></p><p><br></p><p><br/></p><h4>hola</h4>`
  const expected = `<h4>hola</h4>`

  const output = format_wysiwyg(input)

  console.log(output)

  t.assert(expected === output, 'removed all empty p tags')

  t.end()
})