using UnityEngine;

public class Spawner : MonoBehaviour {
    public GameObject[] cube;   // 배열로 게임오브젝트를 몇 개든지 받아들이도록
    public Transform[] point;   //

    public float beat = 1;
    float timer = 0f;


    // RhythmManager를 참조하기 위한 변수
    public RhythmManager rhythmManager;
    private bool isGameStarted = false;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start() {

    }

    // Update is called once per frame
    void Update() {                   // Time.deltaTime 은 프레임마다 다르지만, 결론적으로 정확한 시간 계산식을 위함 (성능에 따라 다른 시간을 똑같이 만들기 위함)
        // 1. 음악이 시작되지 않았다면 아무것도 하지 않음
        // (RhythmManager에서 음악이 재생될 때 이 값을 true로 바꿔주거나 체크 로직 필요)
        if (rhythmManager == null || !rhythmManager.musicSource.isPlaying) return;


        timer += Time.deltaTime;    // timer 에 Time.deltaTime 을 더해서 넣어준다.
        if (timer > beat) {           // timer 가 1초 이상일 때 상자를 만든다.
            int i = Random.Range(0, cube.Length);     // Range 는 (0,2) 0부터 1까지 뽑아라
            int p = Random.Range(0, point.Length);     // Range 는 (0,4) 0부터 3까지 뽑아라

            GameObject obj = Instantiate(cube[i], point[p]);

            obj.transform.localPosition = Vector3.zero;
            obj.transform.Rotate(Vector3.forward, 90 * Random.Range(0, 4));

            timer -= beat;
        }


    }
}
