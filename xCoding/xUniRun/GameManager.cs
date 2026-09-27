using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using TMPro;

public class GameManager : MonoBehaviour {

    public static GameManager instance; // 싱글톤을 할당할 전역 변수
    public GameObject CFXR4FallingStars;
    //public AudioClip startButtonSound;
    public bool isGameover = false; // 게임 오버 상태
    public GameObject gameoverUI; // 게임 오버시 활성화 할 UI 게임 오브젝트
    public TextMeshProUGUI resultScoreText; // 점수를 출력할 UI 텍스트

    public TextMeshProUGUI scoreText; // 점수를 출력할 UI 텍스트
    private int score = 0; // 게임 점수

    public AudioSource bgmAudioSource;  // BGM을 재생할 AudioSource 컴포넌트
    public AudioClip introMusic;
    public AudioClip mainMusic; // AudioSource를 통해 소리가 남, 없으면 안 남 📌
    public AudioClip gameOverMusic;

    public GameObject endMidtermEffect; // endgame일때 중간에 생성되게하는 효과
    public AudioClip endMidtermSound;  // 효과음을 재생할 AudioSource 컴포넌트
    public GameObject AttackButton;


    [Range(0f, 1f)]
    public float bgmVolume = 0.5f;
    [Range(0f, 1f)]
    public float gameOverVolume = 1f;

    void Awake() {
        // 싱글톤 변수 instance가 비어있는가?
        if (instance == null) {
            // instance가 비어있다면(null) 그곳에 자기 자신을 할당
            instance = this;
        } else {
            Debug.LogWarning("씬에 두개 이상의 게임 매니저가 존재합니다!");
            Destroy(gameObject);
        }
    }

    void Start() {
        PlaySceneMusic();
        GameObject effect = Instantiate(CFXR4FallingStars, Vector3.zero, Quaternion.identity);
    }

    void PlaySceneMusic() {
        if (bgmAudioSource == null) { //
            Debug.LogWarning("BGM AudioSource가 할당되지 않았습니다.");
            return;
        }

        bgmAudioSource.volume = bgmVolume; // BGM 볼륨 설정
        bgmAudioSource.loop = true; // BGM 반복 재생 설정

        int sceneIndex = SceneManager.GetActiveScene().buildIndex;

        if (sceneIndex == 0) { // Intro 씬
            bgmAudioSource.clip = introMusic;
            bgmAudioSource.Play();
        } else if (sceneIndex == 1) { // Main 씬
            bgmAudioSource.clip = mainMusic;
            bgmAudioSource.Play();
        }
    }


    public void AddScore(int newScore) {
        if (!isGameover) {
            score += newScore;
            scoreText.text = "Score: " + score; // 점수 UI 갱신
        }
    }

    public void OnPlayerDead() {
        scoreText.gameObject.SetActive(false);
        LevelManager.instance.levelText.gameObject.SetActive(false);

        resultScoreText.text = "BEST Score: " + score; // 게임오버시 최종 점수를 UI에 표시
        isGameover = true;
        gameoverUI.SetActive(true);
        bgmAudioSource.PlayOneShot(endMidtermSound);
        endMidtermEffect.SetActive(true);
        AttackButton.SetActive(false);
        //Destroy.Invoke(endMidtermEffect, 2f); // 2초 후에 중간고사 종료 UI 제거 | Invoke는 몇초뒤에 함수 실행하라는 의미📌


        bgmAudioSource.clip = gameOverMusic; // 게임오버 음악으로 변경
        bgmAudioSource.Play();



    }
}
