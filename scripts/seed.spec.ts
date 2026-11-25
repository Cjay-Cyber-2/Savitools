import test from 'node:test';
import assert from 'node:assert';
import { parseSeedArgs } from './seed';

test('seed.ts CLI validation: parses empty args', () => {
  const res = parseSeedArgs([]);
  assert.deepStrictEqual(res, { help: false, dryRun: false });
});

test('seed.ts CLI validation: parses --help / -h', () => {
  assert.deepStrictEqual(parseSeedArgs(['--help']), { help: true, dryRun: false });
  assert.deepStrictEqual(parseSeedArgs(['-h']), { help: true, dryRun: false });
});

test('seed.ts CLI validation: parses --dry-run', () => {
  assert.deepStrictEqual(parseSeedArgs(['--dry-run']), { help: false, dryRun: true });
});
