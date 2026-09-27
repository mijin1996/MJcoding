using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections; // IEnumerator 사용시 필요

public class ComboManager : MonoBehaviour {
    public static ComboManager Instance;

    public TMP_Text comboText;

    public TMP_Text missText;

    public GameObject gameOverPanel;
    public GameObject gameOverPanel2;

    public TMP_Text finalComboText;

    public int maxMisses = 10;


    public float punchScaleAmount = 1.4f;

    public float punchDuration = 0.15f;

    private int missCount = 0;
    private int combo = 0;
    private Vector3 originalComboScale;
    private Vector3 originalMissScale;
    private Coroutine comboAnimationCoroutine;
    private Coroutine missAnimationCoroutine;

    void Awake() {
        // 싱글톤 설정
        if (Instance == null) {
            Instance = this;
        } else {
            Destroy(gameObject);
            return;
        }

        // gameOverPanel이 Inspector에서 연결 안 된 경우 자동으로 찾기
        if (gameOverPanel == null)
            gameOverPanel = GameObject.Find("GameOverPanel");

        if (gameOverPanel2 == null)
            gameOverPanel2 = GameObject.Find("GameOverPanel2");

        // 게임 시작 시 게임오버 패널 비활성화
        if (gameOverPanel != null) {
            gameOverPanel.SetActive(false);
        }
        if (gameOverPanel2 != null) {
            gameOverPanel2.SetActive(false);
        }

        // 초기 UI 텍스트 갱신
        UpdateComboText();
        UpdateMissText();
    }

    // Awake 뒤에 Start 함수를 새로 추가해 주세요!
    void Start() {
        // 게임이 완전히 시작된 직후의 원래 크기를 안전하게 저장합니다.
        if (comboText != null) {
            originalComboScale = comboText.transform.localScale;
        }
        if (missText != null) {
            originalMissScale = missText.transform.localScale;
        }
    }

    public void AddCombo() {
        combo++;
        UpdateComboText();

        // 콤보가 올라갈 때마다 텍스트가 커졌다 작아지는 애니메이션 실행
        if (comboText != null) {
            // 이미 애니메이션이 돌고 있다면 중복 방지를 위해 멈춤
            if (comboAnimationCoroutine != null) {
                StopCoroutine(comboAnimationCoroutine);
            }

            comboAnimationCoroutine = StartCoroutine(PunchScaleText(comboText, originalComboScale));
        }
    }



    // 텍스트가 커졌다가 부드럽게 원래대로 돌아오는 코루틴
    private IEnumerator PunchScaleText(TMP_Text targetText, Vector3 baseScale) {
        if (targetText == null) yield break;

        // 1. 순간적으로 지정한 배율만큼 크기를 키웁니다.
        targetText.transform.localScale = baseScale * punchScaleAmount;

        float elapsedTime = 0f;

        // 2. punchDuration 동안 서서히 원래 크기로 되돌립니다.
        while (elapsedTime < punchDuration) {
            elapsedTime += Time.deltaTime;

            // targetText의 스케일을 부드럽게 변경합니다.
            targetText.transform.localScale = Vector3.Lerp(
                baseScale * punchScaleAmount,
                baseScale,
                elapsedTime / punchDuration
            );

            yield return null;
        }

        // 3. 완벽하게 원래 크기로 고정
        targetText.transform.localScale = baseScale;
    }

    public void OnMiss() {
        missCount++;
        UpdateMissText();

        // 콤보가 끊겼을 때 흐름을 깨지 않기 위해 0으로 초기화하고 텍스트도 갱신합니다.
        combo = 0;
        UpdateComboText();

        // 콤보가 올라갈 때마다 텍스트가 커졌다 작아지는 애니메이션 실행
        if (missText != null) {
            // 이미 애니메이션이 돌고 있다면 중복 방지를 위해 멈춤
            /*if (comboAnimationCoroutine != null)
            {
                StopCoroutine(comboAnimationCoroutine);
            }*/
            if (missAnimationCoroutine != null) {
                StopCoroutine(missAnimationCoroutine);
            }
            // 애니메이션 코루틴 시작
            missAnimationCoroutine = StartCoroutine(PunchScaleText(missText, originalMissScale));

        }


        if (missCount >= maxMisses) {
            if (gameOverPanel != null)
                gameOverPanel.SetActive(true);

            if (gameOverPanel2 != null)
                gameOverPanel2.SetActive(true);

            // 모든 사바의 GameEnd() 호출
            Saber[] sabers =
                FindObjectsByType<Saber>(FindObjectsSortMode.None);

            foreach (Saber saber in sabers) {
                saber.GameEnd();
            }
            Time.timeScale = 0f; // 게임 일시정지

            // 2. 씬에 있는 모든 음악(노래)을 강제로 일시정지합니다.
            AudioSource[] audios = FindObjectsByType<AudioSource>(FindObjectsSortMode.None);
            foreach (AudioSource audio in audios) {
                audio.Pause();
            }

            // 3. 씬에 있는 모든 배경 영상(비디오)을 강제로 일시정지합니다.
            UnityEngine.Video.VideoPlayer[] videos = FindObjectsByType<UnityEngine.Video.VideoPlayer>(FindObjectsSortMode.None);
            foreach (UnityEngine.Video.VideoPlayer video in videos) {
                video.Pause();
            }
        } else {
            Debug.Log($"미스 {missCount}/{maxMisses} - 아직 게임 종료 아님");
        }
    }

    public void UpdateComboText() {
        if (comboText != null) {
            comboText.text = "COM : " + combo;
        }
    }

    public void UpdateMissText() {
        if (missText != null) {
            missText.text = "MISS : " + missCount; //  + "/" + maxMisses
        }
    }


}
