--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: auditar_codigo_acceso(); Type: FUNCTION; Schema: public; Owner: stratsync_user
--

CREATE FUNCTION public.auditar_codigo_acceso() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria_codigos_acceso (administrador_id, profesor_id, codigo_generado, accion)
        VALUES (NEW.creado_por, NEW.id, NEW.codigo_acceso_maestro, 'CREADO');
    ELSIF TG_OP = 'UPDATE' AND OLD.codigo_acceso_maestro <> NEW.codigo_acceso_maestro THEN
        INSERT INTO auditoria_codigos_acceso (administrador_id, profesor_id, codigo_generado, accion)
        VALUES (NEW.creado_por, NEW.id, NEW.codigo_acceso_maestro, 'MODIFICADO');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auditar_codigo_acceso() OWNER TO stratsync_user;

--
-- Name: generar_codigo_acceso(); Type: FUNCTION; Schema: public; Owner: stratsync_user
--

CREATE FUNCTION public.generar_codigo_acceso() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    nuevo_codigo VARCHAR(20);
BEGIN
    nuevo_codigo := 'PROF-' || substring(md5(random()::text), 1, 8) || 
                    '-' || floor(random() * 100)::text;
    RETURN nuevo_codigo;
END;
$$;


ALTER FUNCTION public.generar_codigo_acceso() OWNER TO stratsync_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administradores; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.administradores (
    id integer NOT NULL,
    usuario character varying(50) NOT NULL,
    "contraseña_hash" character varying(255) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso timestamp without time zone
);


ALTER TABLE public.administradores OWNER TO stratsync_user;

--
-- Name: administradores_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.administradores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administradores_id_seq OWNER TO stratsync_user;

--
-- Name: administradores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.administradores_id_seq OWNED BY public.administradores.id;


--
-- Name: auditoria_codigos_acceso; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.auditoria_codigos_acceso (
    id integer NOT NULL,
    administrador_id integer NOT NULL,
    profesor_id integer NOT NULL,
    codigo_generado character varying(20) NOT NULL,
    fecha_generacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    accion character varying(10),
    CONSTRAINT auditoria_codigos_acceso_accion_check CHECK (((accion)::text = ANY (ARRAY[('CREADO'::character varying)::text, ('MODIFICADO'::character varying)::text, ('ELIMINADO'::character varying)::text])))
);


ALTER TABLE public.auditoria_codigos_acceso OWNER TO stratsync_user;

--
-- Name: auditoria_codigos_acceso_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.auditoria_codigos_acceso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_codigos_acceso_id_seq OWNER TO stratsync_user;

--
-- Name: auditoria_codigos_acceso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.auditoria_codigos_acceso_id_seq OWNED BY public.auditoria_codigos_acceso.id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.categorias OWNER TO stratsync_user;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO stratsync_user;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: horarios; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    dia_semana integer NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    profesor_id integer NOT NULL,
    materia_id integer NOT NULL,
    CONSTRAINT horarios_dia_semana_check CHECK (((dia_semana >= 1) AND (dia_semana <= 7)))
);


ALTER TABLE public.horarios OWNER TO stratsync_user;

--
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_id_seq OWNER TO stratsync_user;

--
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- Name: materias; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo character varying(20) NOT NULL,
    descripcion text,
    categoria_id integer
);


ALTER TABLE public.materias OWNER TO stratsync_user;

--
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_id_seq OWNER TO stratsync_user;

--
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- Name: profesores; Type: TABLE; Schema: public; Owner: stratsync_user
--

CREATE TABLE public.profesores (
    id integer NOT NULL,
    nombres character varying(50) NOT NULL,
    apellidos character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    biografia text,
    categoria_id integer,
    foto_perfil bytea,
    codigo_acceso_maestro character varying(20),
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    creado_por integer
);


ALTER TABLE public.profesores OWNER TO stratsync_user;

--
-- Name: profesores_id_seq; Type: SEQUENCE; Schema: public; Owner: stratsync_user
--

CREATE SEQUENCE public.profesores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesores_id_seq OWNER TO stratsync_user;

--
-- Name: profesores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stratsync_user
--

ALTER SEQUENCE public.profesores_id_seq OWNED BY public.profesores.id;


--
-- Name: administradores id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.administradores ALTER COLUMN id SET DEFAULT nextval('public.administradores_id_seq'::regclass);


--
-- Name: auditoria_codigos_acceso id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.auditoria_codigos_acceso ALTER COLUMN id SET DEFAULT nextval('public.auditoria_codigos_acceso_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- Name: profesores id; Type: DEFAULT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores ALTER COLUMN id SET DEFAULT nextval('public.profesores_id_seq'::regclass);


--
-- Data for Name: administradores; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.administradores (id, usuario, "contraseña_hash", fecha_creacion, ultimo_acceso) FROM stdin;
1	admin	$2a$06$NHzYn7ERTyEMCAlkEWroReUwABRJszIVSvR2P3jhzinLBhEThSNMK	2025-06-03 09:46:58.320663	\N
\.


--
-- Data for Name: auditoria_codigos_acceso; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.auditoria_codigos_acceso (id, administrador_id, profesor_id, codigo_generado, fecha_generacion, accion) FROM stdin;
1	1	1	ABC123XYZ	2025-06-05 12:29:29.330704	CREADO
3	1	3	44407	2025-06-05 19:47:06.352234	CREADO
4	1	3	68148	2025-06-06 15:11:56.78218	MODIFICADO
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.categorias (id, nombre) FROM stdin;
1	Idiomas
2	Matemáticas
3	Humanidades
7	Ciencias
8	Finanzas
9	Computo
\.


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.horarios (id, dia_semana, hora_inicio, hora_fin, profesor_id, materia_id) FROM stdin;
1	1	07:00:00	08:00:00	1	3
2	1	08:00:00	09:00:00	3	4
3	2	09:00:00	10:00:00	1	6
4	3	10:00:00	11:00:00	3	2
5	2	15:58:00	18:58:00	1	1
6	4	18:27:00	19:27:00	3	1
7	5	06:30:00	08:30:00	3	5
8	1	19:42:00	21:42:00	3	4
\.


--
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.materias (id, nombre, codigo, descripcion, categoria_id) FROM stdin;
3	Inglés I	ING101	Curso básico de inglés para principiantes.	1
4	Francés I	FRA101	Introducción al idioma francés.	1
6	Cálculo I	MAT301	Introducción al cálculo diferencial.	2
1	Educación Financiera	GEN101	Conceptos básicos de finanzas personales.	8
2	Taller de Liderazgo	GEN102	Desarrollo de habilidades de liderazgo.	3
7	Historia Universal	HUM101	Historia desde la antigüedad hasta la actualidad.	3
14	Computo en la nube 	35174	AWS AZURE IBM GOOGLE 	\N
5	Álgebra	MAT201	Fundamentos del álgebra.	\N
\.


--
-- Data for Name: profesores; Type: TABLE DATA; Schema: public; Owner: stratsync_user
--

COPY public.profesores (id, nombres, apellidos, correo, telefono, biografia, categoria_id, foto_perfil, codigo_acceso_maestro, activo, fecha_creacion, creado_por) FROM stdin;
1	Laura	Martínez	laura.martinez@example.com	555-1234	Profesora de matemáticas con más de 10 años de experiencia.	2	\N	ABC123XYZ	t	2025-06-05 12:29:29.330704	1
3	Diego 	Pérez Enciso	d.perez@example.com	+1 555-123-4567	Profesional 	\N	\N	68148	t	2025-06-05 19:47:06.352234	1
\.


--
-- Name: administradores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.administradores_id_seq', 1, true);


--
-- Name: auditoria_codigos_acceso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.auditoria_codigos_acceso_id_seq', 4, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.categorias_id_seq', 9, true);


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.horarios_id_seq', 8, true);


--
-- Name: materias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.materias_id_seq', 14, true);


--
-- Name: profesores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stratsync_user
--

SELECT pg_catalog.setval('public.profesores_id_seq', 3, true);


--
-- Name: administradores administradores_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_pkey PRIMARY KEY (id);


--
-- Name: administradores administradores_usuario_key; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_usuario_key UNIQUE (usuario);


--
-- Name: auditoria_codigos_acceso auditoria_codigos_acceso_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.auditoria_codigos_acceso
    ADD CONSTRAINT auditoria_codigos_acceso_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_nombre_key; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nombre_key UNIQUE (nombre);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- Name: materias materias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_codigo_key UNIQUE (codigo);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: profesores profesores_codigo_acceso_maestro_key; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_codigo_acceso_maestro_key UNIQUE (codigo_acceso_maestro);


--
-- Name: profesores profesores_correo_key; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_correo_key UNIQUE (correo);


--
-- Name: profesores profesores_pkey; Type: CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_pkey PRIMARY KEY (id);


--
-- Name: profesores trigger_auditar_codigo; Type: TRIGGER; Schema: public; Owner: stratsync_user
--

CREATE TRIGGER trigger_auditar_codigo AFTER INSERT OR UPDATE ON public.profesores FOR EACH ROW EXECUTE FUNCTION public.auditar_codigo_acceso();


--
-- Name: auditoria_codigos_acceso auditoria_codigos_acceso_administrador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.auditoria_codigos_acceso
    ADD CONSTRAINT auditoria_codigos_acceso_administrador_id_fkey FOREIGN KEY (administrador_id) REFERENCES public.administradores(id);


--
-- Name: auditoria_codigos_acceso auditoria_codigos_acceso_profesor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.auditoria_codigos_acceso
    ADD CONSTRAINT auditoria_codigos_acceso_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.profesores(id) ON DELETE CASCADE;


--
-- Name: horarios horarios_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: horarios horarios_profesor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.profesores(id) ON DELETE CASCADE;


--
-- Name: materias materias_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE SET NULL;


--
-- Name: profesores profesores_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE SET NULL;


--
-- Name: profesores profesores_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stratsync_user
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.administradores(id);


--
-- PostgreSQL database dump complete
--

