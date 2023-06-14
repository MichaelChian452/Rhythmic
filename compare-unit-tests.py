import unittest
from compare import compare

class TestCompareMXL(unittest.TestCase):

    def test_missing_note(self):
        self.assertEqual(compare('compare-tests/skip-mid-a.mxl', 'compare-tests/c-major-scale.mxl'), [('insert', (1, 2, [('1', 'A', '4', '1')]))])
        self.assertEqual(compare('compare-tests/skip-top-c.mxl', 'compare-tests/c-major-scale.mxl'), [('insert', (1, 0, [('1', 'C', '5', '1')]))])
        self.assertEqual(compare('compare-tests/missing-top-c.mxl', 'compare-tests/c-major-scale.mxl'), [('insert', (1, 0, [('1', 'C', '5', '1')]))])

    def test_replace_note(self):
        self.assertEqual(compare('compare-tests/wrong-c-end.mxl', 'compare-tests/c-major-scale.mxl'), [('replace', (2, 3, [('1', 'C', '5', '1')]), (2, 3, [('1', 'C', '4', '1')]))])
        self.assertEqual(compare('compare-tests/multiple-wrong-notes.mxl', 'compare-tests/c-major-scale.mxl'), [('replace', (1, 3, [('1', 'D', '5', '1')]), (1, 3, [('1', 'G', '4', '1')])), ('replace', (2, 0, [('1', 'C', '5', '1')]), (2, 0, [('1', 'F', '4', '1')])), ('replace', (2, 3, [('1', 'C', '5', '1')]), (2, 3, [('1', 'C', '4', '1')]))])
    
    def test_extra_note(self):
        self.assertEqual(compare('compare-tests/extra-c-at-end.mxl', 'compare-tests/c-major-scale.mxl'), [('delete', (3, 0, [('1', 'C', '5', '1')]))])
        self.assertEqual(compare('compare-tests/multiple-extra-notes1.mxl', 'compare-tests/c-major-scale.mxl'), [('delete', (1, 3, [('1', 'B', '4', '1')])), ('delete', (2, 0, [('1', 'C', '5', '1')]))])
        self.assertEqual(compare('compare-tests/multiple-extra-notes2.mxl', 'compare-tests/c-major-scale.mxl'), [('delete', (1, 0, [('1', 'E', '5', '1')])), ('delete', (1, 1, [('1', 'A', '4', '1')])), ('delete', (1, 3, [('1', 'F', '5', '1')])), ('delete', (3, 2, [('1', 'E', '4', '1')])), ('delete', (3, 3, [('1', 'B', '4', '1')]))])

    def test_combination(self):
        self.assertEqual(compare('compare-tests/multiple-errors.mxl', 'compare-tests/c-major-scale.mxl'), [('delete', (1, 0, [('1', 'E', '5', '1')])), ('replace', (2, 1, [('1', 'G', '4', '1')]), (2, 0, [('1', 'F', '4', '1')])), ('delete', (2, 3, [('1', 'C', '4', '1')])), ('replace', (3, 0, [('1', 'E', '4', '1')]), (2, 2, [('1', 'D', '4', '1')]))])

if __name__ == '__main__':
    unittest.main()