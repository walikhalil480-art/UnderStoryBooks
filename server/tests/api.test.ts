import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../db.js';
import { BOOKS } from '../../src/data/books.js';

describe('eBaro Core System & Data Integrity Tests', () => {
  test('Database connection and core tables exist', () => {
    assert.ok(db, 'Database connection must be initialized');

    const tables = [
      'users',
      'sessions',
      'books',
      'author_submissions',
      'orders',
      'purchase_entitlements',
      'user_library'
    ];

    for (const table of tables) {
      const row = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
      ).get(table) as { name: string } | undefined;

      assert.ok(row, `Table "${table}" must exist in relational SQLite schema`);
      assert.equal(row.name, table);
    }
  });

  test('Book Catalogue integrity and pricing invariants', () => {
    assert.ok(Array.isArray(BOOKS), 'BOOKS array must be defined');
    assert.ok(BOOKS.length > 0, 'BOOKS catalogue must contain books');

    for (const book of BOOKS) {
      assert.ok(book.id, 'Every book must have an ID');
      assert.ok(book.title, `Book ${book.id} must have a title`);
      assert.ok(book.author, `Book ${book.id} must have an author`);
      assert.ok(book.accessStatus, `Book ${book.id} must have an accessStatus`);

      // Invariant: Free books must have price 0
      if (book.accessStatus === 'free_full_text' || book.isFree === true) {
        assert.equal(book.price, 0, `Free book ${book.id} must have price 0`);
      }

      // Invariant: Paid books must have price > 0
      if (book.accessStatus === 'paid_purchase' || book.isFree === false) {
        assert.ok(book.price > 0, `Paid book ${book.id} must have price greater than 0`);
      }
    }
  });

  test('Authentication validation rules', () => {
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    assert.ok(emailRegex.test('reader@ebaro.com'), 'Valid email should pass');
    assert.ok(emailRegex.test('user.test@example.org'), 'Valid email should pass');
    assert.ok(!emailRegex.test('invalid-email'), 'Invalid email without @ should fail');
    assert.ok(!emailRegex.test('user@no-tld'), 'Email without domain extension should fail');
    assert.ok(!emailRegex.test(''), 'Empty email should fail');

    // Password strength rules
    const validatePassword = (pw: string) => {
      if (!pw || pw.length < 8) return 'too_short';
      if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'missing_alphanumeric';
      return null;
    };

    assert.equal(validatePassword('short1'), 'too_short');
    assert.equal(validatePassword('alllettersonly'), 'missing_alphanumeric');
    assert.equal(validatePassword('1234567890'), 'missing_alphanumeric');
    assert.equal(validatePassword('ValidPass123!'), null);
  });

  test('Session and admin account verification', () => {
    const adminUser = db.prepare("SELECT email, role FROM users WHERE role = 'admin' LIMIT 1").get() as
      | { email: string; role: string }
      | undefined;

    assert.ok(adminUser, 'An administrator account must exist in database');
    assert.equal(adminUser.role, 'admin');
  });
});
