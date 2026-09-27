using UnityEngine;
using TMPro;
using BlackMassSoftware.FloatingTextEngine.Lite;
using BlackMassSoftware.FloatingTextEngine.Lite.Behaviors;

public class Coin : MonoBehaviour {

    private bool stepped = false;
    public GameObject[] coins;
    public AudioSource coinAudioSource;
    public AudioClip coinSound;
    // public GameObject coinEffectPrefab; // 코인 획득시 재생할 이펙트 프리팹

    public CoinScoreEffect coinScoreEffect;
    private static int coinCnt = 0; // 연달아 코인을 획득할 때마다 증가하는 점수, 총점은 score에서 담당하므로 총점은 신경쓰지 않아도 📌


    private void OnEnable() { //먹었던 코인을 재생성 되도록 하는 부분
        stepped = false;
        for (int i = 0; i < coins.Length; i++) {
            coins[i].SetActive(true);
        }
    }

    void OnTriggerEnter2D(Collider2D other) {
        Debug.Log("코인 충돌됨");

        if (other.tag == "Player" && !stepped) {
            stepped = true;
            //coinScoreEffect.Play(1); // 코인 점수 효과 재생
            coinScoreEffect.Play(coinCnt++); // 연속으로 코인을 먹을 때마다 점수가 증가하도록 함 📌
            GameManager.instance.AddScore(1);
            if (LevelManager.instance != null) {
                LevelManager.instance.AddCoin(1);
            }

            AudioSource.PlayClipAtPoint(coinSound, transform.position); 
            gameObject.SetActive(false);
        }
    }

}
