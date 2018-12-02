const tests = require.context('.', true, /\.spec\.tsx?$/)
tests.keys().forEach(tests)

const components = require.context('../../src/', true, /^(?!.*(?:style|stories|types|$)).*\.tsx?$/)
components.keys().forEach(components)
