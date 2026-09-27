using UnityEngine;
using TMPro;
using System.Collections;

public class RhythmManager : MonoBehaviour {
    public static RhythmManager Instance { get; private set; }
    public AudioSource musicSource;
    public TMP_Text countdownText;
    public bool countdownDone = false; // 카운트다운 완료 여부
    public System.Action OnMusicEnd;
    private float noteTimelineStartMusicTime;

    private void Awake() {
        // 3. 싱글톤 인스턴스 할당 구문 추가
        if (Instance == null) {
            Instance = this;
        } else {
            Destroy(gameObject);
            return;
        }
    }
/*
    void Start()
    {
        PlayMusic();
        StartCoroutine(CountdownAndPlayMusic());
        //StartCoroutine(CountdownAndPlayMusic());
    }
    */

    void Start() {
        musicSource.time = 0f;
        musicSource.Play();

        StartCoroutine(CountdownAndPlayMusic());
    }



    System.Collections.IEnumerator CountdownAndPlayMusic() {
        // yield return new WaitForSeconds(1f); // 일시 대기 (프레임/지정 시간 후 재개)

        for (int i = 3; i > 0; i--) {
            if (countdownText != null)
                countdownText.text = i.ToString();
            Debug.Log(i);
            yield return new WaitForSeconds(1f);
        }

        if (countdownText != null)
            countdownText.text = "GO!";
        Debug.Log("GO!");

        yield return new WaitForSeconds(0.5f);

        if (countdownText != null)
            countdownText.text = "";

        noteTimelineStartMusicTime = musicSource.time;
        countdownDone = true;
    }


    void PlayMusic() {
        musicSource.Play();
    }

    // 현재 음악이 재생된 시간(초)을 반환 (노트 타이밍 계산용)
    public float GetCurrentMusicTime() {
        if (musicSource != null) {
            return musicSource.time;
        }
        return 0f;
    }

    public float GetCurrentNoteTime() {
        if (!countdownDone || musicSource == null)
            return 0f;

        return Mathf.Max(
            0f,
            musicSource.time - noteTimelineStartMusicTime
        );
    }
}
