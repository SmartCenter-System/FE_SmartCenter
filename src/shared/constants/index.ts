export const API_ENDPOINTS = {
  /**
   * Auth endpoints
   */
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VERIFY_EMAIL: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REGISTER_LECTURER: "/api/auth/register-lecturer",
  },

  /**
   * Admin endpoints
   */
  ADMIN: {
    USERS: "/api/admin/users",
    USER_LOCK: (userId: string) => `/api/admin/users/${userId}/lock`,
    USER_UNLOCK: (userId: string) => `/api/admin/users/${userId}/unlock`,
    ORDERS: "/api/admin/orders",
  },

  /**
   * Courses endpoints
   */
  COURSES: {
    BASE: "/api/Courses",
    BY_ID: (courseId: string) => `/api/Courses/${courseId}`,
    PREVIEWS: (courseId: string) => `/api/Courses/${courseId}/previews`,
    TOP_POPULAR: "/api/Courses/top-6-most-popular-courses",
    HIGH_RATED: "/api/Courses/get-top-4-high-rated-recent-reviews-async",
    DASHBOARD: "/api/Courses/dashboard",
  },

  /**
   * Category endpoints
   */
  CATEGORY: {
    GET_ALL: "/api/Category/get-categories",
  },

  /**
   * Cart endpoints
   */
  CART: {
    CREATE: (studentId: string) => `/api/Cart/create/${studentId}`,
    GET: (studentId: string) => `/api/Cart/${studentId}`,
    ADD: "/api/Cart/add",
    REMOVE: "/api/Cart/remove",
  },

  /**
   * Section endpoints (No /api prefix in spec)
   */
  SECTION: {
    BASE: "/Section",
    BY_ID: (sectionId: string) => `/Section/${sectionId}`,
  },

  /**
   * Lesson endpoints
   */
  LESSON: {
    BASE: "/api/Lesson",
    BY_ID: (lessonId: string) => `/api/Lesson/${lessonId}`,
  },

  /**
   * Document endpoints
   */
  DOCUMENT: {
    UPLOAD: "/api/documents/upload",
    BY_LESSON: (lessonId: string) => `/api/documents/lesson/${lessonId}`,
    DELETE: (id: string) => `/api/documents/${id}`,
  },

  /**
   * Enrollment endpoints
   */
  ENROLLMENT: {
    MY: "/Enrollment/my-enrollments",
    BASE: "/Enrollment/create-enrollment",
  },

  /**
   * ExamPaper endpoints (No /api prefix in spec)
   */
  EXAM_PAPER: {
    BASE: "/ExamPaper",
    BY_ID: (examId: string) => `/ExamPaper/${examId}`,
    DEADLINE: (examId: string) => `/ExamPaper/${examId}/deadline`,
    ADD_QUESTIONS: "/ExamPaper/add-questions",
  },

  /**
   * ExamManagement endpoints
   */
  EXAM_MANAGEMENT: {
    START: "/api/ExamManagement/start-exam",
    SUBMIT: "/api/ExamManagement/submit-exam",
    MY_EXAMS: "/api/ExamManagement/my-exams",
    BY_ID: (examId: string) => `/api/ExamManagement/${examId}/get-exams-by-exam-id`,
  },

  /**
   * GradeExam endpoints (No /api prefix in spec)
   */
  GRADE_EXAM: {
    BASE: "/GradeExam",
    MY_DETAILS: "/GradeExam/my-exam-details",
  },

  /**
   * Order endpoints
   */
  ORDER: {
    BASE: "/api/Order",
    ME: "/api/Order/me",
    BY_ID: (orderId: string) => `/api/Order/${orderId}`,
    CANCEL: (orderId: string) => `/api/Order/${orderId}/cancel`,
  },

  /**
   * Payment endpoints
   */
  PAYMENT: {
    CREATE_LINK: "/api/payments/create-link",
    WEBHOOK: "/api/payments/webhook",
  },

  /**
   * ConsultationRequest endpoints
   */
  CONSULTATION: {
    BASE: "/ConsultationRequest",
    CREATE: "/ConsultationRequest/create-consultation-request",
    STATUS: (id: string) => `/ConsultationRequest/${id}/status`,
  },

  /**
   * User Profile endpoints
   */
  USER: {
    PROFILE: "/User/profile",
    UPDATE: "/User/update-profile",
    GET_PROFILE: "/User/profile", // Backward compatibility
    UPDATE_PROFILE: "/User/update-profile", // Backward compatibility
  },

  /**
   * Combo endpoints
   */
  COMBO: {
    BASE: "/Combo",
    BY_ID: (comboId: string) => `/Combo/${comboId}`,
  },

  /**
   * Comment endpoints
   */
  COMMENT: {
    BASE: "/api/comments",
    BY_LESSON: (lessonId: string) => `/api/comments/lesson/${lessonId}`,
    DELETE: (id: string) => `/api/comments/${id}`,
  },

  /**
   * ReviewCourse endpoints
   */
  REVIEW: {
    CREATE: "/ReviewCourse/review-course",
    GET: "/ReviewCourse/get-review-course",
  },

  /**
   * Progress endpoints
   */
  PROGRESS: {
    COMPLETE: "/api/progress/complete",
    BY_COURSE: (courseId: string) => `/api/Progress/${courseId}`,
  },
};
