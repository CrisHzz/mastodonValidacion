/**
 * Datos de prueba reutilizables para tests E2E
 */

export const TestData = {
  // Usuarios de prueba
  users: {
    authenticated: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword123',
    },
  },

  // Términos de búsqueda
  searchTerms: {
    generic: 'mastodon',
    hashtag: 'mastodon',
    nonExistent: 'nonexistentterm12345xyz',
    empty: '',
    specialChars: 'test@#$%',
  },

  // Hashtags de prueba
  hashtags: {
    existing: 'mastodon',
    nonExistent: 'nonexistenthashtag12345',
  },

  // Timeouts y esperas
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    navigation: 30000,
  },
} as const;

