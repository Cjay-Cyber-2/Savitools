import test from 'node:test';
import assert from 'node:assert';
import { parseArgs } from './generate-sdk-specs.mjs';

test('generate-sdk-specs.mjs CLI validation: parses empty args', () => {
  const res = parseArgs([]);
  assert.deepStrictEqual(res, {
    check: false,
    dryRun: false,
    fluxaSource: undefined,
    crowdpaySource: undefined,
  });
});

test('generate-sdk-specs.mjs CLI validation: parses --check and --dry-run', () => {
  const res = parseArgs(['--check', '--dry-run']);
  assert.strictEqual(res.check, true);
  assert.strictEqual(res.dryRun, true);
});
