--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON SCHEMA public IS '';


--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ENROLLED',
    'UNENROLLED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO admin;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'TEACHER',
    'STUDENT'
);


ALTER TYPE public."Role" OWNER TO admin;

--
-- Name: TestProgressStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."TestProgressStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
);


ALTER TYPE public."TestProgressStatus" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Chapter; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Chapter" (
    id text NOT NULL,
    name text NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Chapter" OWNER TO admin;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "teacherId" text NOT NULL,
    "schoolId" text NOT NULL,
    "semesterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Course" OWNER TO admin;

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "courseId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ENROLLED'::public."EnrollmentStatus" NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Enrollment" OWNER TO admin;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    text text NOT NULL,
    level integer NOT NULL,
    "courseId" text NOT NULL,
    "teacherId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Question" OWNER TO admin;

--
-- Name: School; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."School" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."School" OWNER TO admin;

--
-- Name: Semester; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Semester" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Semester" OWNER TO admin;

--
-- Name: Test; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Test" (
    id text NOT NULL,
    name text NOT NULL,
    "totalMarks" integer NOT NULL,
    "courseId" text NOT NULL,
    "teacherId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Test" OWNER TO admin;

--
-- Name: TestQuestion; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."TestQuestion" (
    id text NOT NULL,
    "testId" text NOT NULL,
    "questionId" text NOT NULL
);


ALTER TABLE public."TestQuestion" OWNER TO admin;

--
-- Name: TestStatus; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."TestStatus" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "testId" text NOT NULL,
    status public."TestProgressStatus" DEFAULT 'NOT_STARTED'::public."TestProgressStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TestStatus" OWNER TO admin;

--
-- Name: TestSubmission; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."TestSubmission" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "testId" text NOT NULL,
    "questionId" text NOT NULL,
    answer text NOT NULL,
    "marksObtained" integer DEFAULT 0 NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TestSubmission" OWNER TO admin;

--
-- Name: Topic; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Topic" (
    id text NOT NULL,
    name text NOT NULL,
    "chapterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Topic" OWNER TO admin;

--
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" NOT NULL,
    "schoolId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO admin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Chapter" (id, name, "courseId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Course" (id, name, description, "teacherId", "schoolId", "semesterId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Enrollment" (id, "studentId", "courseId", status, "enrolledAt") FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Question" (id, text, level, "courseId", "teacherId", "createdAt") FROM stdin;
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."School" (id, name, "createdAt") FROM stdin;
\.


--
-- Data for Name: Semester; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Semester" (id, name, "createdAt") FROM stdin;
\.


--
-- Data for Name: Test; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Test" (id, name, "totalMarks", "courseId", "teacherId", "createdAt") FROM stdin;
\.


--
-- Data for Name: TestQuestion; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."TestQuestion" (id, "testId", "questionId") FROM stdin;
\.


--
-- Data for Name: TestStatus; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."TestStatus" (id, "studentId", "testId", status, "updatedAt") FROM stdin;
\.


--
-- Data for Name: TestSubmission; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."TestSubmission" (id, "studentId", "testId", "questionId", answer, "marksObtained", "submittedAt") FROM stdin;
\.


--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Topic" (id, name, "chapterId", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."User" (id, name, email, "passwordHash", role, "schoolId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ab802e06-e022-4312-9b7d-59ff73d2539a	0b36a318d52e0b0e155ba9b1091f159ed00226bb584ee7d7c011b733d5945e8d	2025-03-13 08:51:36.016377+00	20250227115249_init	\N	\N	2025-03-13 08:51:35.996872+00	1
\.


--
-- Name: Chapter Chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: Semester Semester_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Semester"
    ADD CONSTRAINT "Semester_pkey" PRIMARY KEY (id);


--
-- Name: TestQuestion TestQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestQuestion"
    ADD CONSTRAINT "TestQuestion_pkey" PRIMARY KEY (id);


--
-- Name: TestStatus TestStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestStatus"
    ADD CONSTRAINT "TestStatus_pkey" PRIMARY KEY (id);


--
-- Name: TestSubmission TestSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestSubmission"
    ADD CONSTRAINT "TestSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Test Test_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: School_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "School_name_key" ON public."School" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Chapter Chapter_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question Question_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question Question_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestQuestion TestQuestion_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestQuestion"
    ADD CONSTRAINT "TestQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestQuestion TestQuestion_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestQuestion"
    ADD CONSTRAINT "TestQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestStatus TestStatus_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestStatus"
    ADD CONSTRAINT "TestStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestStatus TestStatus_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestStatus"
    ADD CONSTRAINT "TestStatus_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestSubmission TestSubmission_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestSubmission"
    ADD CONSTRAINT "TestSubmission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestSubmission TestSubmission_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestSubmission"
    ADD CONSTRAINT "TestSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestSubmission TestSubmission_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."TestSubmission"
    ADD CONSTRAINT "TestSubmission_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Test Test_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Test Test_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

