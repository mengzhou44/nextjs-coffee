import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../styles/coffee-store.module.css';
import classnames from 'classnames';
import { useEffect, useState, useContext } from 'react';
import { fetchStores } from '../../lib/fetch-stores';
import { StoreContext } from '../../lib/store-context';

export async function getStaticPaths() {
  const stores = await fetchStores();
  return {
    paths: stores.map((item) => {
      return {
        params: {
          id: item.id.toString(),
        },
      };
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let store = {};
  try {
    const stores = await fetchStores();
    store = findStore(stores, params.id);
  } catch (err) {}

  return {
    props: {
      store: store ? store : {},
    },
  };
}

function findStore(stores, id) {
  return stores.find((item) => item.id.toString() === id);
}

export const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0;
};

const CoffeeStore = (props) => {
  const router = useRouter();
  const id = router.query.id;

  const [votingCount, setVotingCount] = useState(0);
  const [store, setStore] = useState(props.store || {});

  const {
    state: { stores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(props.store)) {
      if (stores.length > 0) {
        const found = stores.find((item) => {
          return item.id.toString() === id; //dynamic id
        });
        setStore(found);
      }
    }
  }, [id, props.store, stores]);

  if (router.isFallback) {
    return <h3>Loading ...</h3>;
  }
  const { address, neighborhood, name, imgUrl } = store;

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error('Error upvoting the coffee store', err);
    }
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={classnames('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
