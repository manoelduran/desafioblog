import { GetStaticProps } from 'next';
import  Head  from 'next/head';
import React from 'react';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';
import Link from 'next/link';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.content}>
        <img src="/Logo.svg" alt="logo" />
          {postsPagination.results.map(post => (
            <Link href={`/posts/${post.uid}`}>
              <a key={post.uid}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <time>
                  <FiCalendar />
                  {post.first_publication_date}</time>
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
              </a>
            </Link>
          ))}
          <button type="button">Carregar mais</button>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle','posts.author', 'posts.banner','posts.content'],
    pageSize: 2,
  })

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    };
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }
  return {
    props: {
      postsPagination
    }
  }
};
