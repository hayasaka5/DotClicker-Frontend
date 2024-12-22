import styles from './NotAvailable.module.scss'
function NotAvailable(){
    return(
        <div className={styles.notAvailable}>
            <a >DotClicker</a>
<span>This game is not supported on mobile devices or tablets. For the best experience, we recommend playing on a desktop or laptop computer. We are constantly working to improve and expand our platform, so stay tuned for updates. Thank you for your understanding!</span></div>
    )
}
export default NotAvailable