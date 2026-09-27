using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour {
    public GameObject gameoverText;
    public GameObject homeButton;
    public GameObject Jump;
    public GameObject Run;

    public ParticleSystem rainParticles;
    public ParticleSystem rainParticless;
    public ParticleSystem rainParticlesss;
    public ParticleSystem rainParticlesssss;

    public AudioSource sfxAudioSource;
    public AudioSource bgmAudioSource;
    public AudioClip gameoverBgmClip;

    public Text timeText;
    public Text recordText;
    public Text countdownText;

    private float countdownTime = 3f;
    private float surviveTime;
    private bool isGameover;
    private bool isCountingDown = true;
    public bool IsGameStarted { get; private set; } = false;







    void Start() {

        // 초기 상태 설정, 카운트다운 대기 시작
        surviveTime = 0;
        isGameover = false;

        isCountingDown = true;
        countdownTime = 3f;
        IsGameStarted = false;

        if (countdownText != null) {
            countdownText.gameObject.SetActive(true);
            countdownText.text = "3";
        }
    }

    void Update() {
        if (isCountingDown) {
            // 카운트다운 진행, 3-2-1 후 게임 시작
            countdownTime -= Time.deltaTime;
            if (countdownText != null) {
                if (countdownTime > 2f)
                    countdownText.text = "3";
                else if (countdownTime > 1f)
                    countdownText.text = "2";
                else if (countdownTime > 0f)
                    countdownText.text = "1";
            }

            if (countdownTime <= 0f) {
                isCountingDown = false;
                if (countdownText != null)
                    countdownText.gameObject.SetActive(false);
                StartGame();
            }
        }

        // 카운트다운이 끝나면 생존 시간 누적 및 UI 갱신
        if (!isGameover && IsGameStarted) {
            surviveTime += Time.deltaTime;
            timeText.text = "Time: " + (int)surviveTime;
        } else if (isGameover) {
            if (Input.GetKeyDown(KeyCode.R))
                SceneManager.LoadScene("SampleScene");
        }

    }

    private void StartGame() {
        IsGameStarted = true;

        // 게임 시작 시 BGM 재생 및 조작 버튼 활성화
        if (bgmAudioSource != null && !bgmAudioSource.isPlaying) {
            bgmAudioSource.Play();
        }

        // 점프 버튼 등 게임 요소를 활성화해야 하면 여기서 활성화
        if (Jump != null)
            Jump.SetActive(true);

        if (Run != null)
            Run.SetActive(true);


    }


    public void PlaySound(AudioClip clip) {
        if (clip != null)
            sfxAudioSource.PlayOneShot(clip);
    }


    public void EndGame() {
        // 게임 오버 처리, UI 변경 및 상태 종료
        isGameover = true;
        gameoverText.SetActive(true);
        timeText.gameObject.SetActive(false);
        Jump.SetActive(false);
        Run.SetActive(false);



        if (homeButton != null)
            homeButton.SetActive(true);

        if (rainParticles != null)
            rainParticles.Stop();
        if (rainParticless != null)
            rainParticless.Stop();
        if (rainParticlesss != null)
            rainParticlesss.Stop();
        if (rainParticlesssss != null)
            rainParticlesssss.Stop();

        // 모든 스폰 객체를 비활성화하여 적 동작 정지
        BulletSpawner[] butterflies = FindObjectsByType<BulletSpawner>(FindObjectsSortMode.None);

        foreach (BulletSpawner bfly in butterflies) {

            bfly.enabled = false;

            Animation bflyAni = bfly.GetComponent<Animation>();
            if (bflyAni != null) {
                bflyAni.Stop();
            }
        }

        if (bgmAudioSource != null && gameoverBgmClip != null) {
            bgmAudioSource.Stop();
            bgmAudioSource.clip = gameoverBgmClip;
            bgmAudioSource.loop = true;
            bgmAudioSource.Play();
        }

        float bestTime = PlayerPrefs.GetFloat("BestTime");

        // 최고 생존 시간 갱신 및 저장
        if (surviveTime > bestTime) {
            bestTime = surviveTime;
            PlayerPrefs.SetFloat("BestTime", bestTime);
        }
        recordText.text = "Best Time: " + (int)bestTime;
    }
}
