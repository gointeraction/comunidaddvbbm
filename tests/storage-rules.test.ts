/**
 * @vitest-environment node
 */
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const rulesPath = resolve(__dirname, '../storage.rules');
  const rules = readFileSync(rulesPath, 'utf8');

  testEnv = await initializeTestEnvironment({
    projectId: 'comunidadbbm-storage-test',
    storage: { rules },
  });
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearStorage();
  }
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

describe('Storage Rules - Avatars', () => {
  it('should allow users to upload their own avatar', async () => {
    const alice = testEnv.authenticatedContext('alice');
    const profileRef = alice.storage().ref('avatars/alice/profile.png');
    
    await assertSucceeds(profileRef.putString('fake-image-data', 'raw', { contentType: 'image/png' }));
  });

  it('should deny users from uploading avatars to other accounts', async () => {
    const alice = testEnv.authenticatedContext('alice');
    const hackerRef = alice.storage().ref('avatars/bob/profile.png');
    
    await assertFails(hackerRef.putString('fake-image-data', 'raw', { contentType: 'image/png' }));
  });

  it('should deny uploading files that are not images', async () => {
    const alice = testEnv.authenticatedContext('alice');
    const profileRef = alice.storage().ref('avatars/alice/malware.exe');
    
    await assertFails(profileRef.putString('fake-exe-data', 'raw', { contentType: 'application/x-msdownload' }));
  });

  it('should allow anyone to read avatars', async () => {
    // First, upload a file as Alice so it exists
    const alice = testEnv.authenticatedContext('alice');
    const profileRef = alice.storage().ref('avatars/alice/profile.png');
    await profileRef.putString('fake-image-data', 'raw', { contentType: 'image/png' });

    // Then, try to read it as unauthenticated
    const unauth = testEnv.unauthenticatedContext();
    const publicRef = unauth.storage().ref('avatars/alice/profile.png');
    
    // Reads should succeed
    await assertSucceeds(publicRef.getDownloadURL());
  });
});

describe('Storage Rules - Course Covers', () => {
  it('should allow moderators to upload course covers', async () => {
    const mod = testEnv.authenticatedContext('mod1', { moderator: true });
    const coverRef = mod.storage().ref('course-covers/course1/cover.jpg');
    
    await assertSucceeds(coverRef.putString('fake-image-data', 'raw', { contentType: 'image/jpeg' }));
  });

  it('should deny regular users from uploading course covers', async () => {
    const user = testEnv.authenticatedContext('user1');
    const coverRef = user.storage().ref('course-covers/course1/cover.jpg');
    
    await assertFails(coverRef.putString('fake-image-data', 'raw', { contentType: 'image/jpeg' }));
  });
});
