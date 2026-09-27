using System.Collections; // 코루틴을 위해 반드시 필요합니다!
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneChanger : MonoBehaviour {
    public string sceneName;
    [Header("--- 효과 설정 ---")]
    public AudioSource audioSourceSpeaker;
    public AudioClip clickSound;
    public GameObject clickEffectPrefab;

    // 이펙트와 소리를 처리하고, 딜레이 후 액션을 실행하는 코루틴
    private IEnumerator PlayEffectsAndLoad(System.Action loadAction) {
        // 1. 소리 재생
        if (audioSourceSpeaker != null && clickSound != null)
            audioSourceSpeaker.PlayOneShot(clickSound);

        // 2. 이펙트 생성
        if (clickEffectPrefab != null) {
            // [수정] 3D 좌표가 아닌, UI 버튼의 정확한 스크린(화면) 위치를 가져옵니다.
            Vector3 buttonScreenPos = transform.position;

            // 이펙트를 생성합니다.
            GameObject effect = Instantiate(clickEffectPrefab, buttonScreenPos, Quaternion.identity);

            // [핵심] 생성된 이펙트를 버튼이 속한 Canvas 안으로 집어넣습니다.
            effect.transform.SetParent(transform.parent, false);

            // 자식으로 들어가면서 좌표가 틀어지지 않도록 버튼의 위치와 완전히 일치시킵니다.
            effect.transform.position = buttonScreenPos;

            // UI 크기에 맞게 이펙트 스케일을 (1, 1, 1)로 초기화합니다.
            effect.transform.localScale = Vector3.one;

            Destroy(effect, 2f);
        }

        // 3. 이펙트가 보일 만큼 잠깐 대기 (0.2초 ~ 0.3초 추천)
        // Time.timeScale = 0(일시정지) 상태에서도 작동하도록 Realtime을 씁니다.
        yield return new WaitForSecondsRealtime(0.5f);

        // 4. 대기 후 넘겨받은 씬 전환 기능 실행
        loadAction?.Invoke();
    }

    // 버튼 클릭 시 호출할 함수들
    public void ChangeScene() {
        StartCoroutine(PlayEffectsAndLoad(() => {
            if (!string.IsNullOrEmpty(sceneName))
                SceneManager.LoadScene(sceneName);
            else
                Debug.LogWarning("이동할 씬 이름이 설정되지 않았습니다!");
        }));
    }

    public void Restart(int sceneIndex) {
        StartCoroutine(PlayEffectsAndLoad(() => {
            Time.timeScale = 1f;
            SceneManager.LoadScene(sceneIndex);
        }));
    }

    public void QuitGame() {
        StartCoroutine(PlayEffectsAndLoad(() => {
            Time.timeScale = 1f;
            Application.Quit();
        }));
    }
}












// using UnityEngine;
// using UnityEngine.SceneManagement; // 씬 관리를 위해 반드시 필요합니다.

// public class SceneChanger : MonoBehaviour
// {
//     // 이동할 씬의 이름을 입력받을 변수
//     public string sceneName;
//     [Header("--- 효과 설정 ---")]
//     public AudioSource audioSourceSpeaker;      // 오디오 소스 컴포넌트
//     public AudioClip clickSound;         // 재생할 효과음
//     public GameObject clickEffectPrefab; // 터트릴 파티클 프리팹

//     // 이펙트와 소리를 처리하는 핵심 공통 함수
//     private void PlayEffects()
//     {
//         // 소리 재생
//         if (audioSourceSpeaker != null && clickSound != null)
//             audioSourceSpeaker.PlayOneShot(clickSound);

//         // 이펙트 생성 및 2초 뒤 자동 삭제
//         if (clickEffectPrefab != null)
//         {
//             GameObject effect = Instantiate(clickEffectPrefab, transform.position, Quaternion.identity);
//             Destroy(effect, 2f);
//         }
//     }







//     // 버튼 클릭 시 호출할 함수
//     public void ChangeScene()
//     {
//         PlayEffects();

//         if (!string.IsNullOrEmpty(sceneName))
//         {
//             SceneManager.LoadScene(sceneName);
//         }
//         else
//         {
//             Debug.LogWarning("이동할 씬 이름이 설정되지 않았습니다!");
//         }
//     }




//       public void Restart(int sceneIndex)
//     {
//         PlayEffects();

//         Time.timeScale = 1f;
//         SceneManager.LoadScene(sceneIndex);
//         // SceneManager.LoadScene(SceneManager.GetActiveScene().name);
//     }


// //아래 함수는 적용된 버튼이 없음
//     public void QuitGame()
//     {
//         PlayEffects();

//         Time.timeScale = 1f;
//         Application.Quit();
//     }
// }
