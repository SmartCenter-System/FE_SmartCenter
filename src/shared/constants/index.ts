export const API_ENDPOINTS = {
  /**
   * Auth endpoints
   * - LOGIN: POST /api/auth/login
   * - REGISTER: POST /api/auth/register
   * - LOGOUT: POST /api/auth/logout (chưa có trong spec, giữ để dùng interceptor)
   * - REFRESH: POST /api/auth/refresh (chưa có trong spec, giữ để dùng interceptor)
   * - VERIFY_EMAIL: GET /api/auth/verify-email?code=
   * - FORGOT_PASSWORD: POST /api/auth/forgot-password
   * - RESET_PASSWORD: POST /api/auth/reset-password
   * - REGISTER_LECTURER: POST /api/auth/register-lecturer
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
   * Courses endpoints
   * - BASE: GET/POST /api/Courses
   * - BY_ID: GET/PUT/DELETE /api/Courses/:courseId
   * - PREVIEWS: GET /api/Courses/:courseId/previews
   */
  COURSES: {
    BASE: "/api/Courses",
    BY_ID: (courseId: string) => `/api/Courses/${courseId}`,
    PREVIEWS: (courseId: string) => `/api/Courses/${courseId}/previews`,
    TOP_POPULAR: "/api/Courses/top-6-most-popular-courses",
  },

  /**
   * Cart endpoints
   * - CREATE: POST /api/Cart/create/:studentId
   * - GET: GET /api/Cart/:studentId
   * - ADD: POST /api/Cart/add
   * - REMOVE: DELETE /api/Cart/remove
   */
  CART: {
    CREATE: (studentId: string) => `/api/Cart/create/${studentId}`,
    GET: (studentId: string) => `/api/Cart/${studentId}`,
    ADD: "/api/Cart/add",
    REMOVE: "/api/Cart/remove",
  },

  /**
   * Section endpoints (không có /api prefix)
   * - BASE: GET/POST /Section?courseId=
   * - BY_ID: PUT/DELETE /Section/:sectionId?courseId=
   */
  SECTION: {
    BASE: "/Section",
    BY_ID: (sectionId: string) => `/Section/${sectionId}`,
  },

  /**
   * Lesson endpoints (không có /api prefix)
   * - BASE: GET/POST /Lesson?courseId=&sectionId=
   * - BY_ID: PUT/DELETE /Lesson/:lessonId?courseId=&sectionId=
   */
  LESSON: {
    BASE: "/Lesson",
    BY_ID: (lessonId: string) => `/Lesson/${lessonId}`,
  },

  /**
   * Enrollment endpoints (không có /api prefix)
   * - MY: GET /Enrollment/MyEnrollments
   * - BASE: POST /Enrollment
   */
  ENROLLMENT: {
    MY: "/Enrollment/my-enrollments",
    BASE: "/Enrollment",
  },

  /**
   * ExamPaper endpoints (không có /api prefix)
   * - BASE: GET/POST /ExamPaper?courseId=
   * - BY_ID: PUT/DELETE /ExamPaper/:examId
   * - DEADLINE: POST /ExamPaper/:examId/deadline
   */
  EXAM_PAPER: {
    BASE: "/ExamPaper",
    BY_ID: (examId: string) => `/ExamPaper/${examId}`,
    DEADLINE: (examId: string) => `/ExamPaper/${examId}/deadline`,
  },

  /**
   * ExamManagement endpoints
   * - START: POST /api/ExamManagement/StartExam?ExamId=
   * - SUBMIT: POST /api/ExamManagement/SubmitExam (multipart/form-data)
   * - MY_EXAMS: GET /api/ExamManagement/MyExams
   * - BY_ID: GET /api/ExamManagement/:ExamId/GetExamsByExamId
   */
  EXAM_MANAGEMENT: {
    START: "/api/ExamManagement/StartExam",
    SUBMIT: "/api/ExamManagement/SubmitExam",
    MY_EXAMS: "/api/ExamManagement/MyExams",
    BY_ID: (examId: string) => `/api/ExamManagement/${examId}/GetExamsByExamId`,
  },

  /**
   * GradeExam endpoints (không có /api prefix)
   * - BASE: POST /GradeExam
   * - MY_DETAILS: GET /GradeExam/MyExamDetails?ExamId=
   */
  GRADE_EXAM: {
    BASE: "/GradeExam",
    MY_DETAILS: "/GradeExam/MyExamDetails",
  },

  /**
   * Order endpoints
   * - BASE: POST /api/Order
   * - ME: GET /api/Order/me
   * - BY_ID: GET /api/Order/:orderId
   * - CANCEL: PUT /api/Order/:orderId/cancel
   */
  ORDER: {
    BASE: "/api/Order",
    ME: "/api/Order/me",
    BY_ID: (orderId: string) => `/api/Order/${orderId}`,
    CANCEL: (orderId: string) => `/api/Order/${orderId}/cancel`,
  },

  /**
   * Payment endpoints
   * - CREATE_LINK: POST /api/payments/create-link?orderId=
   * - WEBHOOK: POST /api/payments/webhook
   */
  PAYMENT: {
    CREATE_LINK: "/api/payments/create-link",
    WEBHOOK: "/api/payments/webhook",
  },

  /**
   * ConsultationRequest endpoints (không có /api prefix)
   * - CREATE: POST /ConsultationRequest/CreateConsultationRequest (multipart/form-data)
   */
  CONSULTATION: {
    CREATE: "/ConsultationRequest/CreateConsultationRequest",
  },

  /**
   * Combo endpoints
   * - BASE: GET/POST /api/Combos
   * - BY_ID: GET/PUT/DELETE /api/Combos/:comboId
   */
  COMBO: {
    BASE: "/api/Combos",
    BY_ID: (comboId: string) => `/api/Combos/${comboId}`,
  },
};
