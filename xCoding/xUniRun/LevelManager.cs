using UnityEngine;
using TMPro;

public class LevelManager : MonoBehaviour {
    public AudioSource levelUpSound;
    public GameObject levelUpEffectPrefab;

    public static LevelManager instance;

    public TextMeshProUGUI levelText;

    public int level = 1;
    public int coinsForLevelUp = 5;

    private int currentCoinCnt = 0;

    void Awake() {
        instance = this;
    }

    public void AddCoin(int amount) { // 코인을 추가하고 레벨업 여부를 확인하는 메서드
        currentCoinCnt += amount;

        if (currentCoinCnt >= coinsForLevelUp) {
            LevelUp();
        }
    }

    void LevelUp() {
        level++;
        currentCoinCnt = 0;

        if (levelText != null) {
            levelText.text = "LV. " + level;
            levelUpSound.Play(); // 레벨업 사운드 재생

            GameObject destryEffect = Instantiate(levelUpEffectPrefab, transform.position, Quaternion.identity); // 레벨업 이펙트 생성
            Destroy(destryEffect, 0.5f);
        }

        Debug.Log("레벨업! 현재 레벨: " + level);

    }


}
