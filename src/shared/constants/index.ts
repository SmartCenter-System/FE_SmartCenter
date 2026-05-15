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
    REGISTER_STAFF: "/api/auth/register-staff",
  },

  /**
   * Admin endpoints
   */
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (userId: string) => `/api/admin/users/${userId}`,
    USER_LOCK: (userId: string) => `/api/admin/users/${userId}/lock`,
    USER_UNLOCK: (userId: string) => `/api/admin/users/${userId}/unlock`,
    ORDERS: "/api/admin/orders",
    DASHBOARD_STATS: "/api/admin/dashboard/stats",
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
    CREATE: "/api/Category/create-categories",
    UPDATE: "/api/Category/update-categories",
    DELETE: (categoryId: string) => `/api/Category/categories/${categoryId}`,
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
   * Section endpoints
   */
  SECTION: {
    BASE: "/api/Section",
    BY_ID: (sectionId: string) => `/api/Section/${sectionId}`,
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
    MY: "/api/Enrollment/my-enrollments",
    BASE: "/api/Enrollment/create-enrollment",
  },

  /**
   * ExamPaper endpoints
   */
  EXAM_PAPER: {
    BASE: "/api/ExamPaper",
    BY_ID: (examId: string) => `/api/ExamPaper/${examId}`,
    DEADLINE: (examId: string) => `/api/ExamPaper/${examId}/deadline`,
    ADD_QUESTIONS: "/api/ExamPaper/add-questions",
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
   * GradeExam endpoints
   */
  GRADE_EXAM: {
    BASE: "/api/GradeExam",
    MY_DETAILS: "/api/GradeExam/my-exam-details",
    SUBMITTED: "/api/GradeExam/submitted-exams",
  },

  /**
   * Order endpoints
   */
  ORDER: {
    BASE: "/api/Order",
    ME: "/api/Order/me",
    BY_ID: (orderId: string) => `/api/Order/${orderId}`,
    CANCEL: (orderId: string) => `/api/Order/${orderId}/cancel`,
    STATUS: (orderId: string) => `/api/Order/${orderId}/status`,
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
    BASE: "/api/ConsultationRequest",
    CREATE: "/api/ConsultationRequest/create-consultation-request",
    STATUS: (id: string) => `/api/ConsultationRequest/${id}/status`,
    ACCEPT: (id: string) => `/api/ConsultationRequest/${id}/accept`,
    REJECT: (id: string) => `/api/ConsultationRequest/${id}/reject`,
    STATS: "/api/ConsultationRequest/dashboard/stats",
    ENROLLMENT: "/api/ConsultationRequest/Enrollment",
  },

  /**
   * User Profile endpoints
   */
  USER: {
    PROFILE: "/api/User/profile",
    UPDATE: "/api/User/update-profile",
    GET_PROFILE: "/api/User/profile", // Backward compatibility
    UPDATE_PROFILE: "/api/User/update-profile", // Backward compatibility
  },

  /**
   * Combo endpoints
   */
  COMBO: {
    BASE: "/api/Combo",
    BY_ID: (comboId: string) => `/api/Combo/${comboId}`,
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
    CREATE: "/api/ReviewCourse/review-course",
    GET: "/api/ReviewCourse/get-review-course",
  },

  /**
   * Progress endpoints
   */
  PROGRESS: {
    COMPLETE: "/api/progress/complete",
    BY_COURSE: (courseId: string) => `/api/progress/course/${courseId}`,
  },
};
