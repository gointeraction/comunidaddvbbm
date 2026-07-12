import { initializeTestEnvironment, RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, beforeAll, afterAll, beforeEach, it } from 'vitest';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  // Load rules from the root firestore.rules file
  const rulesPath = resolve(__dirname, '../firestore.rules');
  const rules = readFileSync(rulesPath, 'utf8');

  testEnv = await initializeTestEnvironment({
    projectId: 'comunidadbbm-test',
    firestore: { rules },
  });
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

describe('Firestore Rules - Users Collection', () => {
  it('should allow reads for authenticated users', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(alice.firestore().collection('users').doc('bob').get());
  });

  it('should deny public reads for unauthenticated users', async () => {
    const unauth = testEnv.unauthenticatedContext();
    await assertFails(unauth.firestore().collection('users').doc('alice').get());
  });

  it('should allow users to update their own profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('users').doc('alice').set({ name: 'Old' });
    });
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(alice.firestore().collection('users').doc('alice').update({ name: 'Alice' }));
  });

  it('should deny users from updating other profiles', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(alice.firestore().collection('users').doc('bob').update({ name: 'Hacked' }));
  });

  it('should allow admins to delete a user', async () => {
    const admin = testEnv.authenticatedContext('adminId', { admin: true });
    await assertSucceeds(admin.firestore().collection('users').doc('alice').delete());
  });
});

describe('Firestore Rules - Courses Collection', () => {
  it('should allow moderators to create a course', async () => {
    const mod = testEnv.authenticatedContext('modId', { moderator: true });
    await assertSucceeds(mod.firestore().collection('courses').doc('course1').set({ title: 'New Course', authorId: 'modId' }));
  });

  it('should deny regular users from creating a course', async () => {
    const user = testEnv.authenticatedContext('user1');
    await assertFails(user.firestore().collection('courses').doc('course2').set({ title: 'Hack Course' }));
  });

  it('should allow authors to update their own course', async () => {
    // Note: We need a document to exist to evaluate resource.data.authorId for updates
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('courses').doc('course3').set({ authorId: 'author123', title: 'Original' });
    });

    const author = testEnv.authenticatedContext('author123');
    await assertSucceeds(author.firestore().collection('courses').doc('course3').update({ title: 'Updated' }));
  });

  it('should deny other users from updating a course they do not own', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('courses').doc('course4').set({ authorId: 'author123', title: 'Original' });
    });

    const hacker = testEnv.authenticatedContext('hacker999');
    await assertFails(hacker.firestore().collection('courses').doc('course4').update({ title: 'Hacked' }));
  });
});

describe('Firestore Rules - Achievements Collection', () => {
  it('should deny regular users from granting themselves achievements', async () => {
    const user = testEnv.authenticatedContext('user1');
    await assertFails(user.firestore().collection('userAchievements').doc('user1').collection('unlocked').doc('ach1').set({ date: 'now' }));
  });

  it('should allow admins to grant achievements', async () => {
    const admin = testEnv.authenticatedContext('adminId', { admin: true });
    await assertSucceeds(admin.firestore().collection('userAchievements').doc('user1').collection('unlocked').doc('ach1').set({ date: 'now' }));
  });
});
