using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class UIM : MonoBehaviour {
    public static UIM instance {
        get {
            if (uim == null) {
                uim = FindObjectOfType<UIM>();
            }
            return uim;
        }
    }

    private static UIM uim;
    public Text ammoText;
    public Text scoreText;
    public Text waveText;
    public GameObject gameoverUI;

    public void UpdateAmmoText(int magAmmo, int remainAmmo) {
        ammoText.text = magAmmo + "/" + remainAmmo;
    }

    public void UpdateScoreText(int newScore) {
        scoreText.text = "Score : " + newScore;
    }

    public void UpdateWaveText(int waves, int count) {
        waveText.text = "Wave : " + waves + "\nEnemy Left : " + count;
    }

    public void SetActiveGameoverUI(bool active) {
        gameoverUI.SetActive(active);
    }

    public void GameRestart() {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}
