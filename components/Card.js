import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.css';
import classnames from 'classnames'

const Card = ({ href, name, imgUrl }) => {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={classnames(styles.container, 'glass')}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>

          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={imgUrl}
              width={260}
              height={160}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
